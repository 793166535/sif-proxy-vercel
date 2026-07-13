// api/mcp.js — Vercel Serverless Function
// 将此文件放在项目根目录的 api/ 文件夹下
// 版本: 2026-07-13 (含 Accept header 修复)

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, secret-key, Accept');

  // 健康检查
  if (req.method === 'GET') {
    res.status(200).json({ status: 'ok', version: '2026-07-13' });
    return;
  }

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ jsonrpc: '2.0', error: { code: -32600, message: 'Method not allowed' }, id: null });
    return;
  }

  const secretKey = req.headers['secret-key'];
  if (!secretKey) {
    res.status(400).json({ jsonrpc: '2.0', error: { code: -32600, message: 'Missing secret-key header' }, id: null });
    return;
  }

  try {
    // 确保 body 不为空
    const bodyStr = req.body ? JSON.stringify(req.body) : '{}';

    const response = await fetch(
      `https://mcp.sif.com/mcp?secret-key=${encodeURIComponent(secretKey)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream',
          'secret-key': secretKey,
        },
        body: bodyStr,
      }
    );

    const data = await response.text();
    res
      .status(response.status)
      .setHeader('Content-Type', response.headers.get('content-type') || 'application/json')
      .send(data);
  } catch (error) {
    res.status(502).json({
      jsonrpc: '2.0',
      error: { code: -32603, message: `Proxy error: ${error.message}` },
      id: null,
    });
  }
}
