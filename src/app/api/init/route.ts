import { NextResponse } from 'next/server';
import { initializeApp } from '@/lib/init';

// 初始化数据库的API路由
export async function GET() {
  try {
    console.log('开始执行数据库初始化...');
    
    // 初始化应用
    const success = await initializeApp();
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: '数据库初始化成功',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: '数据库初始化失败，请检查日志获取详细信息',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
  } catch (error) {
    console.error('初始化API错误:', error);
    return NextResponse.json({ 
      success: false, 
      message: '初始化过程中发生错误', 
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 