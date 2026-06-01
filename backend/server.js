const express = require('express');
const cors = require('cors');
const { pool } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors()); // 允许跨域，方便本地开发 uni-app 联调
app.use(express.json()); // 解析 JSON 格式的请求体
app.use(express.static('public')); // 托管静态文件（用于托管管理端单页面）

// ==========================================
// 1. 管理端登录与身份验证
// ==========================================

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'your-admin-password';
const AUTH_TOKEN = 'your-auth-token'; // 简易Token，实际项目可用 JWT

// 管理员登录 API
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({
      code: 200,
      msg: '登录成功',
      data: { token: AUTH_TOKEN }
    });
  }
  return res.status(401).json({ code: 401, msg: '账号或密码错误' });
});

// 管理端权限拦截中间件
const adminAuth = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token === AUTH_TOKEN) {
    next();
  } else {
    res.status(403).json({ code: 403, msg: '未授权访问，请重新登录' });
  }
};

// ==========================================
// 2. 管理端 API (需要权限验证)
// ==========================================

// --- 解析接口 CRUD ---
// 获取所有解析接口列表
app.get('/api/admin/apis', adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM analysis_apis ORDER BY sort_order ASC, id DESC');
    res.json({ code: 200, data: rows });
  } catch (err) {
    res.status(500).json({ code: 500, msg: err.message });
  }
});

// 新增解析接口
app.post('/api/admin/apis', adminAuth, async (req, res) => {
  const { name, url, status, sort_order } = req.body;
  if (!name || !url) {
    return res.status(400).json({ code: 400, msg: '名称和地址不能为空' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO analysis_apis (name, url, status, sort_order) VALUES (?, ?, ?, ?)',
      [name, url, status !== undefined ? status : 1, sort_order || 0]
    );
    res.json({ code: 200, msg: '添加成功', data: { id: result.insertId } });
  } catch (err) {
    res.status(500).json({ code: 500, msg: err.message });
  }
});

// 修改解析接口
app.put('/api/admin/apis/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { name, url, status, sort_order } = req.body;
  try {
    await pool.query(
      'UPDATE analysis_apis SET name = ?, url = ?, status = ?, sort_order = ? WHERE id = ?',
      [name, url, status, sort_order, id]
    );
    res.json({ code: 200, msg: '更新成功' });
  } catch (err) {
    res.status(500).json({ code: 500, msg: err.message });
  }
});

// 删除解析接口
app.delete('/api/admin/apis/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM analysis_apis WHERE id = ?', [id]);
    res.json({ code: 200, msg: '删除成功' });
  } catch (err) {
    res.status(500).json({ code: 500, msg: err.message });
  }
});


// --- 导航站点 CRUD ---
// 获取所有导航站点列表
app.get('/api/admin/sites', adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM navigation_sites ORDER BY sort_order ASC, id DESC');
    res.json({ code: 200, data: rows });
  } catch (err) {
    res.status(500).json({ code: 500, msg: err.message });
  }
});

// 新增导航站点
app.post('/api/admin/sites', adminAuth, async (req, res) => {
  const { name, url, logo, status, sort_order } = req.body;
  if (!name || !url) {
    return res.status(400).json({ code: 400, msg: '名称和地址不能为空' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO navigation_sites (name, url, logo, status, sort_order) VALUES (?, ?, ?, ?, ?)',
      [name, url, logo || '', status !== undefined ? status : 1, sort_order || 0]
    );
    res.json({ code: 200, msg: '添加成功', data: { id: result.insertId } });
  } catch (err) {
    res.status(500).json({ code: 500, msg: err.message });
  }
});

// 修改导航站点
app.put('/api/admin/sites/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { name, url, logo, status, sort_order } = req.body;
  try {
    await pool.query(
      'UPDATE navigation_sites SET name = ?, url = ?, logo = ?, status = ?, sort_order = ? WHERE id = ?',
      [name, url, logo || '', status, sort_order, id]
    );
    res.json({ code: 200, msg: '更新成功' });
  } catch (err) {
    res.status(500).json({ code: 500, msg: err.message });
  }
});

// 删除导航站点
app.delete('/api/admin/sites/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM navigation_sites WHERE id = ?', [id]);
    res.json({ code: 200, msg: '删除成功' });
  } catch (err) {
    res.status(500).json({ code: 500, msg: err.message });
  }
});

// --- 搜索平台 CRUD ---
// 获取所有搜索平台列表
app.get('/api/admin/platforms', adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM search_platforms ORDER BY sort_order ASC, id DESC');
    res.json({ code: 200, data: rows });
  } catch (err) {
    res.status(500).json({ code: 500, msg: err.message });
  }
});

// 新增搜索平台
app.post('/api/admin/platforms', adminAuth, async (req, res) => {
  const { name, search_url, status, sort_order } = req.body;
  if (!name || !search_url) {
    return res.status(400).json({ code: 400, msg: '名称和搜索地址不能为空' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO search_platforms (name, search_url, status, sort_order) VALUES (?, ?, ?, ?)',
      [name, search_url, status !== undefined ? status : 1, sort_order || 0]
    );
    res.json({ code: 200, msg: '添加成功', data: { id: result.insertId } });
  } catch (err) {
    res.status(500).json({ code: 500, msg: err.message });
  }
});

// 修改搜索平台
app.put('/api/admin/platforms/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { name, search_url, status, sort_order } = req.body;
  try {
    await pool.query(
      'UPDATE search_platforms SET name = ?, search_url = ?, status = ?, sort_order = ? WHERE id = ?',
      [name, search_url, status, sort_order, id]
    );
    res.json({ code: 200, msg: '更新成功' });
  } catch (err) {
    res.status(500).json({ code: 500, msg: err.message });
  }
});

// 删除搜索平台
app.delete('/api/admin/platforms/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM search_platforms WHERE id = ?', [id]);
    res.json({ code: 200, msg: '删除成功' });
  } catch (err) {
    res.status(500).json({ code: 500, msg: err.message });
  }
});


// ==========================================
// 3. 用户端/小程序端 API (公开无须登录)
// ==========================================

// 获取启用的解析接口（小程序下拉框展示）
app.get('/api/client/apis', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, url FROM analysis_apis WHERE status = 1 ORDER BY sort_order ASC, id DESC');
    res.json({ code: 200, data: rows });
  } catch (err) {
    res.status(500).json({ code: 500, msg: err.message });
  }
});

// 获取启用的导航站点（小程序列表展示）
app.get('/api/client/sites', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, url, logo FROM navigation_sites WHERE status = 1 ORDER BY sort_order ASC, id DESC');
    res.json({ code: 200, data: rows });
  } catch (err) {
    res.status(500).json({ code: 500, msg: err.message });
  }
});

// 获取启用的搜索平台（小程序搜片下拉展示）
app.get('/api/client/platforms', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, search_url FROM search_platforms WHERE status = 1 ORDER BY sort_order ASC, id DESC');
    res.json({ code: 200, data: rows });
  } catch (err) {
    res.status(500).json({ code: 500, msg: err.message });
  }
});

// 微信静默登录/一键登录
app.post('/api/client/wx-login', async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ code: 400, msg: 'Code 不能为空' });
  }
  
  // 实际微信登录开发流程：
  // 1. 请求微信接口：https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
  // 2. 换取 openid 和 session_key
  // 这里为了本地快速开发/无AppID测试，我们在无法连上微信服务器时提供一个 Mock 的 openid
  try {
    // Mock 流程：直接以 code_openid 作为标识
    const openid = `mock_openid_${code.substring(0, 10)}`;
    res.json({
      code: 200,
      msg: '登录成功',
      data: {
        openid,
        token: `client-token-${openid}`
      }
    });
  } catch (err) {
    res.status(500).json({ code: 500, msg: err.message });
  }
});


// ==========================================
// 4. 启动服务
// ==========================================
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🎉 FeiTools 后端API服务已成功启动！`);
  console.log(`📡 服务监听端口: ${PORT}`);
  console.log(`🔗 管理后台地址: http://localhost:${PORT}/admin/index.html`);
  console.log(`=========================================`);
});
