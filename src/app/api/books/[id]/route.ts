import { NextRequest, NextResponse } from 'next/server';
import { getBookById, getBookTags } from '@/lib/models/book';
import { getBookChapters } from '@/lib/models/book';

// 获取书籍详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ 
        success: false, 
        message: '无效的书籍ID',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }
    
    // 获取书籍详情
    const book = await getBookById(id);
    
    if (!book) {
      return NextResponse.json({ 
        success: false, 
        message: '未找到书籍',
        timestamp: new Date().toISOString()
      }, { status: 404 });
    }
    
    // 获取书籍标签
    const tags = await getBookTags(id);
    
    // 获取书籍章节
    const chapters = await getBookChapters(id);
    
    return NextResponse.json({ 
      success: true, 
      data: {
        ...book,
        tags,
        chapters: chapters.map(chapter => ({
          id: chapter.id,
          chapter_number: chapter.chapter_number,
          chapter_title: chapter.chapter_title
        }))
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('获取书籍详情失败:', error);
    return NextResponse.json({ 
      success: false, 
      message: '获取书籍详情失败', 
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 