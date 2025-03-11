import { NextRequest, NextResponse } from 'next/server';
import { getRecommendedBooks, getNewBooks, searchBooks, Book } from '@/lib/models/book';
import { getBooksByCategory } from '@/lib/models/book';
import { getCategoryByName } from '@/lib/models/category';

// 获取书籍列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'recommended';
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || '';
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    
    let books: Book[] = [];
    
    if (type === 'recommended') {
      // 获取推荐书籍
      books = await getRecommendedBooks(limit);
    } else if (type === 'new') {
      // 获取最新书籍
      books = await getNewBooks(limit);
    } else if (type === 'search' && query) {
      // 搜索书籍
      books = await searchBooks(query, limit);
    } else if (type === 'category' && category) {
      // 根据分类获取书籍
      const categoryObj = await getCategoryByName(category);
      if (categoryObj) {
        books = await getBooksByCategory(categoryObj.id, limit);
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      data: books,
      count: books.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('获取书籍列表失败:', error);
    return NextResponse.json({ 
      success: false, 
      message: '获取书籍列表失败', 
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 