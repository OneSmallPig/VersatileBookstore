import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/models/user';

// 用户登录
export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const body = await request.json();
    
    if (!body.email || !body.password) {
      return NextResponse.json({ 
        success: false, 
        message: '邮箱和密码不能为空',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }
    
    // 登录用户
    const result = await loginUser(body.email, body.password);
    
    if (result.error) {
      return NextResponse.json({ 
        success: false, 
        message: result.error,
        timestamp: new Date().toISOString()
      }, { status: 401 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: {
        user: result.user,
        token: result.token
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('用户登录失败:', error);
    return NextResponse.json({ 
      success: false, 
      message: '用户登录失败', 
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 