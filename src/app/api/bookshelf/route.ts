import { NextRequest, NextResponse } from 'next/server';
import { getUserBookshelf, addToBookshelf } from '@/lib/models/user';

// 获取用户书架
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
    
    // 获取用户书架
    const bookshelf = await getUserBookshelf(userId);
    
    return NextResponse.json({ 
      success: true, 
      data: bookshelf,
      count: bookshelf.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('获取用户书架失败:', error);
    return NextResponse.json({ 
      success: false, 
      message: '获取用户书架失败', 
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// 添加书籍到书架
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
    
    // 添加书籍到书架
    const success = await addToBookshelf(userId, bookId);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: '已添加到书架',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: '添加到书架失败',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
  } catch (error) {
    console.error('添加书籍到书架失败:', error);
    return NextResponse.json({ 
      success: false, 
      message: '添加书籍到书架失败', 
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 