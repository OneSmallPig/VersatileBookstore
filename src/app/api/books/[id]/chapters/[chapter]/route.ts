import { NextRequest, NextResponse } from 'next/server';
import { getChapterContent } from '@/lib/models/book';

// 获取书籍章节内容
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; chapter: string } }
) {
  try {
    const bookId = parseInt(params.id, 10);
    const chapterNumber = parseInt(params.chapter, 10);
    
    if (isNaN(bookId) || isNaN(chapterNumber)) {
      return NextResponse.json({ 
        success: false, 
        message: '无效的书籍ID或章节号',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }
    
    // 获取章节内容
    const chapter = await getChapterContent(bookId, chapterNumber);
    
    if (!chapter) {
      return NextResponse.json({ 
        success: false, 
        message: '未找到章节内容',
        timestamp: new Date().toISOString()
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: chapter,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('获取章节内容失败:', error);
    return NextResponse.json({ 
      success: false, 
      message: '获取章节内容失败', 
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 