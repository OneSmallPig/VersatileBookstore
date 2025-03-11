import { NextRequest, NextResponse } from 'next/server';
import { getPostById, getPostComments } from '@/lib/models/community';

// 获取帖子详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ 
        success: false, 
        message: '无效的帖子ID',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }
    
    // 从请求头中获取用户ID（如果有）
    const userId = request.headers.get('x-user-id') ? 
      parseInt(request.headers.get('x-user-id') || '0', 10) : 
      undefined;
    
    // 获取帖子详情
    const post = await getPostById(id, userId);
    
    if (!post) {
      return NextResponse.json({ 
        success: false, 
        message: '未找到帖子',
        timestamp: new Date().toISOString()
      }, { status: 404 });
    }
    
    // 获取帖子评论
    const comments = await getPostComments(id);
    
    return NextResponse.json({ 
      success: true, 
      data: {
        post,
        comments
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('获取帖子详情失败:', error);
    return NextResponse.json({ 
      success: false, 
      message: '获取帖子详情失败', 
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 