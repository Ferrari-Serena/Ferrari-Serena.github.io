// 简单的本地服务器 — 用于浏览标点符号练习网页
// 用法: node server.js
// 然后在浏览器打开 http://localhost:3000/标点符号0624.html

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;
const DEFAULT_FILE = '标点符号0624.html';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.pdf':  'application/pdf',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.json': 'application/json',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

function resolvePath(urlPath) {
  // Decode URL
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch (e) {
    decoded = urlPath;
  }

  // Remove leading slash(es) and convert to platform path
  decoded = decoded.replace(/^\/+/, '').replace(/\//g, path.sep);

  let fullPath = path.join(ROOT, decoded);

  // If it's a directory or root, serve the default file
  try {
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
      fullPath = path.join(fullPath, DEFAULT_FILE);
    }
  } catch (e) { /* fall through */ }

  // If path ends with separator, serve default file
  if (fullPath.endsWith(path.sep)) {
    fullPath = path.join(fullPath, DEFAULT_FILE);
  }

  // Security: ensure path is within ROOT
  const normalized = path.normalize(fullPath);
  if (!normalized.startsWith(path.normalize(ROOT))) {
    return null;
  }

  return normalized;
}

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  // Special case: root
  if (urlPath === '/' || urlPath === '') {
    const indexPath = path.join(ROOT, DEFAULT_FILE);
    fs.readFile(indexPath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
        return;
      }
      res.writeHead(200, {
        'Content-Type': MIME['.html'],
        'Access-Control-Allow-Origin': '*',
      });
      res.end(data);
    });
    return;
  }

  const filePath = resolvePath(urlPath);
  if (!filePath) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': mime,
      'Access-Control-Allow-Origin': '*',
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n📝 标点符号练习服务器已启动`);
  console.log(`   打开浏览器访问: http://localhost:${PORT}/`);
  console.log(`   或: http://localhost:${PORT}/标点符号0624.html`);
  console.log(`\n   按 Ctrl+C 停止服务器\n`);
});
