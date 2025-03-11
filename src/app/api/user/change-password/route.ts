import { NextRequest, NextResponse } from 'next/server';
import { changePassword } from '@/lib/models/user';

// 更改密码
export async function POST(request: NextRequest) {
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
    
    // 获取请求体
    const body = await request.json();
    
    if (!body.currentPassword || !body.newPassword) {
      return NextResponse.json({ 
        success: false, 
        message: '当前密码和新密码不能为空',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }
    
    // 验证新密码长度
    if (body.newPassword.length < 6) {
      return NextResponse.json({ 
        success: false, 
        message: '新密码长度不能少于6个字符',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }
    
    // 更改密码
    const result = await changePassword(userId, body.currentPassword, body.newPassword);
    
    if (result.error) {
      return NextResponse.json({ 
        success: false, 
        message: result.error,
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: '密码已更改',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('更改密码失败:', error);
    return NextResponse.json({ 
      success: false, 
      message: '更改密码失败', 
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 