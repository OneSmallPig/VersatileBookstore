import { checkDatabaseConnection, createTables } from './db';
import { initializeDatabase } from './init-db';

// 初始化应用
export async function initializeApp() {
  try {
    console.log('开始初始化应用...');
    
    // 检查数据库连接
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error('无法连接到数据库，请检查数据库配置');
    }
    
    // 创建数据库表
    await createTables();
    
    // 初始化数据库数据
    await initializeDatabase();
    
    console.log('应用初始化完成！');
    return true;
  } catch (error) {
    console.error('应用初始化失败:', error);
    return false;
  }
} 