import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import http from 'http';
import https from 'https';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'api-proxy-middleware',
        configureServer(server) {
          server.middlewares.use('/api/proxy', (req, res) => {
            const parsedUrl = new URL(req.url || '', 'http://localhost');
            const target = parsedUrl.searchParams.get('target');
            if (!target) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Missing target parameter' }));
              return;
            }

            try {
              const targetObj = new URL(target);
              const client = targetObj.protocol === 'https:' ? https : http;

              const proxyReq = client.request(target, {
                method: req.method || 'GET',
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                  'Accept': 'application/json, text/plain, */*',
                  'Origin': targetObj.origin
                }
              }, (proxyRes) => {
                res.statusCode = proxyRes.statusCode || 200;
                res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                proxyRes.pipe(res);
              });

              proxyReq.on('error', (err) => {
                res.statusCode = 502;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Proxy request failed: ' + err.message }));
              });

              if (req.method === 'POST' || req.method === 'PUT') {
                req.pipe(proxyReq);
              } else {
                proxyReq.end();
              }
            } catch (err: any) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Invalid target URL: ' + err.message }));
            }
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
