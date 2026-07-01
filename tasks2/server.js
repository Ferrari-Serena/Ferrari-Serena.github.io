// 通用静态服务器 — Ferrariwork/tasks2
// 用法: node server.js
// 然后浏览器打开 http://localhost:3000

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

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
  '.txt':  'text/plain; charset=utf-8',
  '.md':   'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  // 根路径 → index.html
  if (urlPath === '/' || urlPath === '') {
    serveFile(path.join(ROOT, 'index.html'), res);
    return;
  }

  const filePath = path.join(ROOT, decodeURIComponent(urlPath).replace(/\//g, path.sep));

  // 安全检查
  if (!path.normalize(filePath).startsWith(path.normalize(ROOT))) {
    res.writeHead(403);
    res.end('403 Forbidden');
    return;
  }

  serveFile(filePath, res);
});

function serveFile(filePath, res) {
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
}

server.listen(PORT, () => {
  console.log(`\n  Ferrariwork/tasks2 服务器已启动`);
  console.log(`  入口页面: http://localhost:${PORT}/`);
  console.log(`\n  注意: 蚕食和 Word Wind 需要分别启动各自的 Vite 开发服务器`);
  console.log(`    蚕食:     cd tasks2/vocabulary && npm run dev    → http://localhost:2000`);
  console.log(`    Word Wind: cd tasks2/word-wind && npm run dev   → http://localhost:5173`);
  console.log(`\n  按 Ctrl+C 停止服务器\n`);
});
