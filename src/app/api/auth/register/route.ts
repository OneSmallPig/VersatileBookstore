import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/models/user';

// 用户注册
export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const body = await request.json();
    
    if (!body.username || !body.email || !body.password) {
      return NextResponse.json({ 
        success: false, 
        message: '用户名、邮箱和密码不能为空',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ 
        success: false, 
        message: '邮箱格式不正确',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }
    
    // 验证密码长度
    if (body.password.length < 6) {
      return NextResponse.json({ 
        success: false, 
        message: '密码长度不能少于6个字符',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }
    
    // 注册用户
    const result = await registerUser(body.username, body.email, body.password);
    
    if (result.error) {
      return NextResponse.json({ 
        success: false, 
        message: result.error,
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: {
        user: result.user
      },
      message: '注册成功',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('用户注册失败:', error);
    return NextResponse.json({ 
      success: false, 
      message: '用户注册失败', 
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 