import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/models/user';

// 获取用户信息
export async function GET(request: NextRequest) {
  try {
    // 从请求头中获取用户ID
    const userIdHeader = request.headers.get('x-user-id');
    
    if (!userIdHeader) {
      return NextResponse.json({ 
        success: false, 
        message: '未提供用户ID',
        timestamp: new Date().toISOString()
      }, { status: 401 });
    }
    
    const userId = parseInt(userIdHeader, 10);
    
    if (isNaN(userId)) {
      return NextResponse.json({ 
        success: false, 
        message: '无效的用户ID',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }
    
    // 获取用户信息
    const user = await getUserById(userId);
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: '未找到用户',
        timestamp: new Date().toISOString()
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: user,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return NextResponse.json({ 
      success: false, 
      message: '获取用户信息失败', 
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 