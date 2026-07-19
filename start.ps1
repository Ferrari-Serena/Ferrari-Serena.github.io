# Ferrariwork 一键启动 — 背单词
# 用法：右键此文件 → "使用 PowerShell 运行"，或在终端输入 .\start.ps1

param(
    [string]$Page = "wordwind"   # wordwind | canshi | tasks2 | home
)

$urls = @{
    "wordwind" = "http://localhost:5173/tasks2/word-wind/dist/"
    "canshi"   = "http://localhost:5173/tasks2/vocabulary/docs/"
    "tasks2"   = "http://localhost:5173/tasks2/"
    "home"     = "http://localhost:5173/"
}

$target = $urls[$Page]
if (-not $target) { $target = $urls["wordwind"] }

Write-Host ""
Write-Host "  ╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "  ║        Ferrariwork  单词学习中...            ║" -ForegroundColor Cyan
Write-Host "  ╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 先打开浏览器
Start-Process $target
Write-Host "  浏览器已打开: $target" -ForegroundColor Green
Write-Host ""

# 启动服务器（阻塞运行，Ctrl+C 停止）
node server.js

# 如果 node 不在 PATH 中，尝试备用路径
if ($LASTEXITCODE -ne 0) {
    Write-Host "  node 未在 PATH 中找到，尝试备用路径..." -ForegroundColor Yellow
    & "D:\my AI agent\node.exe" server.js
}
