const mysql = require('mysql2/promise');
require('dotenv').config();

// 创建连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'feitools_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试连接的方法
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('🎉 FeiTools 数据库连接成功！');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ FeiTools 数据库连接失败，错误详情:', error.message);
    console.error('请检查 FeiTools/backend/.env 文件中的数据库配置，并确保 MySQL 服务已启动。');
    return false;
  }
}

// 导出 pool 和 testConnection
module.exports = {
  pool,
  testConnection
};

// 如果直接运行此脚本，则执行连接测试
if (require.main === module) {
  testConnection();
}
