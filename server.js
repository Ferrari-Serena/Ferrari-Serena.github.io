// Ferrariwork 统一静态服务器
// 用法: node server.js
// 然后浏览器打开 http://localhost:5173
// 端口 5173 = 与 Vite 开发服务器一致，确保 localStorage 数据互通

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 5173;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.mjs':  'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.txt':  'text/plain; charset=utf-8',
  '.md':   'text/plain; charset=utf-8',
  '.pdf':  'application/pdf',
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0].split('#')[0];

  // 根路径 → index.html
  if (urlPath === '/' || urlPath === '') {
    urlPath = '/index.html';
  }

  const filePath = path.join(ROOT, decodeURIComponent(urlPath).replace(/\//g, path.sep));

  // 安全检查：防止目录遍历攻击
  if (!path.normalize(filePath).startsWith(path.normalize(ROOT))) {
    res.writeHead(403);
    res.end('403 Forbidden');
    return;
  }

  // 如果路径是目录，尝试 index.html
  serveFile(filePath, res, true);
});

function serveFile(filePath, res, tryIndex) {
  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found: ' + path.relative(ROOT, filePath));
      return;
    }

    if (stats.isDirectory()) {
      if (tryIndex) {
        serveFile(path.join(filePath, 'index.html'), res, false);
      } else {
        res.writeHead(404);
        res.end('404 Not Found (directory)');
      }
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(500);
        res.end('500 Internal Server Error');
        return;
      }
      res.writeHead(200, {
        'Content-Type': mime,
        'Access-Control-Allow-Origin': '*',
      });
      res.end(data);
    });
  });
}

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log('');
  console.log('  ╔══════════════════════════════════════════════╗');
  console.log('  ║        Ferrariwork 项目服务器已启动          ║');
  console.log('  ╚══════════════════════════════════════════════╝');
  console.log('');
  console.log(`  入口页面:   ${url}/`);
  console.log(`  tasks1:     ${url}/tasks1/`);
  console.log(`  tasks2:     ${url}/tasks2/`);
  console.log(`  蚕食单词:   ${url}/tasks2/vocabulary/docs/`);
  console.log(`  Word Wind:  ${url}/tasks2/word-wind/dist/`);
  console.log('');
  console.log('  按 Ctrl+C 停止服务器');
  console.log('');
});
