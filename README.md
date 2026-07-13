# SIF MCP Proxy — Vercel 部署

## 快速部署

1. 将此项目上传到 GitHub
2. 在 Vercel 中 Import 此仓库
3. 点击 Deploy 即可

## 手动部署

```bash
npx vercel --prod
```

## 使用

部署成功后，将获得的 URL（如 `https://your-project.vercel.app`）
填入系统设置的「代理 URL」输入框中。

代理端点：`POST /api/mcp`
