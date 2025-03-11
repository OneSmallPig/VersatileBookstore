import { NextRequest, NextResponse } from 'next/server';
import { getCommunityPosts, Post } from '@/lib/models/community';

// 获取社区帖子列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    
    // 获取社区帖子
    const posts: Post[] = await getCommunityPosts(limit, offset);
    
    return NextResponse.json({ 
      success: true, 
      data: posts,
      count: posts.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('获取社区帖子列表失败:', error);
    return NextResponse.json({ 
      success: false, 
      message: '获取社区帖子列表失败', 
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 