import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// InfinityFree slowAES Solver State
let cachedInfinityCookie = '';
let lastCookieTimestamp = 0;

function decryptInfinityToken(html: string): string | null {
  try {
    const aMatch = html.match(/a=toNumbers\("([a-f0-9]+)"\)/);
    const bMatch = html.match(/b=toNumbers\("([a-f0-9]+)"\)/);
    const cMatch = html.match(/c=toNumbers\("([a-f0-9]+)"\)/);
    if (!aMatch || !bMatch || !cMatch) return null;

    const key = Buffer.from(aMatch[1], 'hex');
    const iv = Buffer.from(bMatch[1], 'hex');
    const ciphertext = Buffer.from(cMatch[1], 'hex');

    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    decipher.setAutoPadding(false);
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return decrypted.toString('hex').toLowerCase();
  } catch (err) {
    console.error('[Server Proxy] Error decrypting token:', err);
    return null;
  }
}

async function requestInfinityFree(targetUrl: string, options: RequestInit = {}): Promise<{ status: number; text?: string; buffer?: Buffer; contentType: string; isBinary: boolean }> {
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  
  // Re-use cached cookie if less than 4 hours old
  const isCookieFresh = (Date.now() - lastCookieTimestamp) < (4 * 60 * 60 * 1000);
  let cookieHeader = (isCookieFresh && cachedInfinityCookie) ? cachedInfinityCookie : '';

  let headers: Record<string, string> = {
    'User-Agent': ua,
    'Accept': '*/*',
    ...(options.headers as Record<string, string> || {})
  };
  if (cookieHeader) {
    headers['Cookie'] = cookieHeader;
  }

  let resp = await fetch(targetUrl, { ...options, headers });
  let contentType = resp.headers.get('content-type') || 'text/plain';
  let isImage = contentType.includes('image/') || /\.(png|jpe?g|gif|webp|ico|svg)($|\?)/i.test(targetUrl);

  // If not image, check for challenge in text
  let text = '';
  if (!isImage) {
    text = await resp.text();
    if (text.includes('slowAES')) {
      console.log('[Server Proxy] InfinityFree challenge detected. Decrypting security token...');
      const token = decryptInfinityToken(text);
      if (token) {
        cachedInfinityCookie = `__test=${token}`;
        lastCookieTimestamp = Date.now();

        const nextUrlMatch = text.match(/location\.href="([^"]+)"/);
        const activationUrl = nextUrlMatch ? nextUrlMatch[1] : targetUrl;

        await fetch(activationUrl, {
          method: 'GET',
          headers: {
            'User-Agent': ua,
            'Cookie': cachedInfinityCookie
          }
        });

        headers['Cookie'] = cachedInfinityCookie;
        resp = await fetch(targetUrl, { ...options, headers });
        contentType = resp.headers.get('content-type') || 'text/plain';
        text = await resp.text();
      }
    }
    return {
      status: resp.status,
      text,
      contentType,
      isBinary: false
    };
  }

  // Handle binary images
  const arrayBuf = await resp.arrayBuffer();
  const buffer = Buffer.from(arrayBuf);
  return {
    status: resp.status,
    buffer,
    contentType,
    isBinary: true
  };
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    proxy_active: true,
    infinityfree_cookie_cached: !!cachedInfinityCookie
  });
});

// Dedicated Live Resort Bridge Endpoint (Handles both GET and POST actions)
app.all(['/api/resort-bridge', '/api/proxy'], async (req, res) => {
  try {
    let target = (req.query.target as string) || 'http://catzhouse.kesug.com/api.php';
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'http://catzhouse.kesug.com/' + target.replace(/^\//, '');
    }

    const method = req.method.toUpperCase();
    console.log(`[Proxy] ${method} -> ${target}`);

    let fetchOptions: RequestInit = {
      method: method
    };

    if (method === 'POST') {
      const contentType = req.headers['content-type'] || '';
      if (typeof req.body === 'object' && Object.keys(req.body).length > 0) {
        const params = new URLSearchParams();
        for (const [k, v] of Object.entries(req.body)) {
          if (v !== undefined && v !== null) {
            params.append(k, String(v));
          }
        }
        fetchOptions.headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };
        fetchOptions.body = params.toString();
      } else if (typeof req.body === 'string') {
        fetchOptions.headers = {
          'Content-Type': contentType || 'application/x-www-form-urlencoded'
        };
        fetchOptions.body = req.body;
      }
    }

    const result = await requestInfinityFree(target, fetchOptions);

    if (result.isBinary && result.buffer) {
      res.setHeader('Content-Type', result.contentType);
      return res.status(result.status === 200 ? 200 : result.status).send(result.buffer);
    }

    // If it is JSON or contains JSON substring, format as application/json
    const text = result.text || '';
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');

    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      const cleanJson = text.substring(jsonStart, jsonEnd + 1);
      try {
        const parsed = JSON.parse(cleanJson);
        res.setHeader('Content-Type', 'application/json');
        return res.status(result.status === 200 ? 200 : result.status).json(parsed);
      } catch (e) {
        // Fallback to raw
      }
    }

    res.setHeader('Content-Type', result.contentType);
    return res.status(result.status).send(text);
  } catch (err: any) {
    console.error('[Proxy Error]', err);
    return res.status(500).json({
      status: 'error',
      message: err.message || 'Internal proxy server error'
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
