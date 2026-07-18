const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_HOST = '127.0.0.1';
const DB_PORT = 3306;
const DB_USER = process.env.DB_USER || 'your-db-user';
const DB_NAME = 'feitools_db';

async function runSetup() {
  console.log('🚀 开始尝试自动配置本地 MySQL 数据库...');
  
  let activePassword = null;
  let connection = null;

  // 1. 尝试使用现有的 .env 配置连接
  const currentPass = process.env.DB_PASSWORD || '';
  console.log('正在尝试 .env 中配置的数据库密码...');
  try {
    connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: currentPass,
      multipleStatements: true
    });
    activePassword = currentPass;
    console.log('✅ 使用现有的 .env 密码成功建立连接！');
  } catch (err) {
    console.log('❌ 使用 .env 配置连接失败。');
  }

  // 2. 如果失败，报错并退出。不要在脚本里枚举或打印常见密码。
  if (!connection) {
    console.error('\n❌ 无法连接到本地 MySQL 服务。');
    console.error('可能的原因：');
    console.error('1. 您本地的 MySQL 服务没有启动。');
    console.error('2. backend/.env 中的 DB_PASSWORD 配置不正确。');
    console.error('\n请手动启动 MySQL，或在 backend/.env 中配置 DB_PASSWORD，然后手动导入 init.sql。');
    process.exit(1);
  }

  // 3. 创建数据库
  try {
    console.log(`正在创建数据库 ${DB_NAME} (若不存在)...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`);
    
    // 切换到 feitools_db 数据库
    await connection.query(`USE \`${DB_NAME}\`;`);

    // 4. 读取并导入 SQL 脚本
    console.log('正在读取并导入 init.sql 数据表结构...');
    const sqlPath = path.join(__dirname, 'init.sql');
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`找不到初始化SQL文件: ${sqlPath}`);
    }
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    await connection.query(sqlContent);
    console.log('🎉 数据库表与初始数据导入成功！');

  } catch (error) {
    console.error('❌ 数据库操作失败:', error.message);
    await connection.end();
    process.exit(1);
  } finally {
    await connection.end();
  }

  // 5. 自动更新 .env 文件
  try {
    console.log('正在更新 .env 配置文件...');
    const envPath = path.join(__dirname, '.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      
      // 替换密码和数据库名称
      envContent = envContent.replace(/DB_PASSWORD=.*/, `DB_PASSWORD=${activePassword}`);
      envContent = envContent.replace(/DB_NAME=.*/, `DB_NAME=${DB_NAME}`);
      envContent = envContent.replace(/DB_HOST=.*/, `DB_HOST=${DB_HOST}`);
    } else {
      // 如果不存在则新建一个，只写占位值，避免仓库或日志中出现真实密码。
      envContent = `PORT=3000\nDB_HOST=${DB_HOST}\nDB_PORT=3306\nDB_USER=${DB_USER}\nDB_PASSWORD=${activePassword}\nDB_NAME=${DB_NAME}\nADMIN_USER=your-admin-user\nADMIN_PASS=your-admin-password\nAUTH_TOKEN=your-auth-token\n`;
    }
    
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('✅ .env 配置文件更新成功！');
    console.log('\n=========================================');
    console.log('🎉 FeiTools 本地数据库自动创建和配置顺利完成！');
    console.log('=========================================');
  } catch (error) {
    console.error('❌ 无法保存 .env 配置文件:', error.message);
  }
}

runSetup();
