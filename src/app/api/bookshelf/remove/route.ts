import { NextRequest, NextResponse } from 'next/server';
import { removeFromBookshelf } from '@/lib/models/user';

// 从书架中移除书籍
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
    
    if (!body.bookId) {
      return NextResponse.json({ 
        success: false, 
        message: '未提供书籍ID',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }
    
    const bookId = parseInt(body.bookId, 10);
    
    if (isNaN(bookId)) {
      return NextResponse.json({ 
        success: false, 
        message: '无效的书籍ID',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }
    
    // 从书架中移除书籍
    const success = await removeFromBookshelf(userId, bookId);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: '已从书架中移除',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: '从书架中移除失败',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
  } catch (error) {
    console.error('从书架中移除书籍失败:', error);
    return NextResponse.json({ 
      success: false, 
      message: '从书架中移除书籍失败', 
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 