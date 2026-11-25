const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.mkv': 'video/x-matroska'
};

function proxyRequest(req, res, targetPort, targetPath) {
  const options = {
    hostname: '127.0.0.1',
    port: targetPort,
    path: targetPath || req.url,
    method: req.method,
    headers: { ...req.headers, host: `127.0.0.1:${targetPort}` }
  };

  const proxy = http.request(options, (targetRes) => {
    const headers = { ...targetRes.headers };
    headers['access-control-allow-origin'] = '*';
    headers['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
    headers['access-control-allow-headers'] = '*';
    res.writeHead(targetRes.statusCode, headers);
    targetRes.pipe(res, { end: true });
  });

  proxy.on('error', (err) => {
    res.writeHead(502, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*'
    });
    res.end(JSON.stringify({ status: false, message: 'Proxy Error: ' + err.message }));
  });

  req.pipe(proxy, { end: true });
}

function createStaticServer(rootDir, port, name, proxyConfig) {
  const server = http.createServer((req, res) => {
    // CORS headers for Web & Flutter Web requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    // Direct fast serve for /uploaded files if present on disk
    if (req.url.startsWith('/uploaded/')) {
      const uploadRel = decodeURIComponent(req.url.split('?')[0].replace(/^\/uploaded\//, ''));
      const candidatePaths = [
        path.join(__dirname, 'uploaded', uploadRel),
        path.join(__dirname, 'panchayatpostbackend', 'uploaded', uploadRel),
      ];
      for (const cp of candidatePaths) {
        if (fs.existsSync(cp) && fs.statSync(cp).isFile()) {
          const ext = path.extname(cp).toLowerCase();
          const contentType = MIME_TYPES[ext] || 'application/octet-stream';
          res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=86400',
            'Access-Control-Allow-Origin': '*'
          });
          fs.createReadStream(cp).pipe(res);
          return;
        }
      }
    }

    // Proxy check
    if (proxyConfig) {
      const prefixes = Array.isArray(proxyConfig.prefix) ? proxyConfig.prefix : [proxyConfig.prefix];
      const match = prefixes.find(p => req.url.startsWith(p));
      if (match) {
        proxyRequest(req, res, proxyConfig.targetPort);
        return;
      }
    }

    let reqPath = req.url.split('?')[0];
    let filePath = path.join(rootDir, reqPath);

    // Fallback to index.html for SPA client-side routing
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(rootDir, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Disable caching for local development so edits appear instantly
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });

  server.listen(port, () => {
    console.log(`[${name}] running at http://localhost:${port}`);
  });

  return server;
}

// Start admin on port 3000 (with /adminapi, /api, /uploaded, and /app/ proxy to 4000)
const adminDir = path.join(__dirname, 'admin');
createStaticServer(adminDir, 3000, 'PanchayatPost Admin Portal', {
  prefix: ['/adminapi', '/api', '/uploaded', '/app/'],
  targetPort: 4000
});

// Start egramadmin on port 3001 (with /api proxy to 5800)
const egramAdminDir = path.join(__dirname, 'egramadmin');
createStaticServer(egramAdminDir, 3001, 'EGram Panchayat Admin Portal', {
  prefix: '/api',
  targetPort: 5800
});

// Start egramweb on port 3002
const egramWebDir = path.join(__dirname, 'egramweb');
createStaticServer(egramWebDir, 3002, 'EGram Citizen Web App');

// Start PosterBanao mobile app on port 3003 (with /api and /uploaded proxy to 4000)
const posterBanaoDir = path.join(__dirname, 'posterbanao_app', 'assets', 'public');
createStaticServer(posterBanaoDir, 3003, 'PosterBanao Mobile Poster App', {
  prefix: ['/api', '/uploaded'],
  targetPort: 4000
});
