import { NextRequest, NextResponse } from 'next/server';
import { getAllCategories, getPopularCategories } from '@/lib/models/category';

// 获取分类列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    let categories = [];
    
    if (type === 'popular') {
      // 获取热门分类
      categories = await getPopularCategories(limit);
    } else {
      // 获取所有分类
      categories = await getAllCategories();
    }
    
    return NextResponse.json({ 
      success: true, 
      data: categories,
      count: categories.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('获取分类列表失败:', error);
    return NextResponse.json({ 
      success: false, 
      message: '获取分类列表失败', 
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 