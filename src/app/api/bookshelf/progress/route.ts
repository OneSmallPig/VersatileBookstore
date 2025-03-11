import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// 更新阅读进度
export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const { bookId, progress } = await request.json();
    if (!bookId || typeof progress !== 'number' || progress < 0 || progress > 100) {
      return NextResponse.json({ error: '无效的参数' }, { status: 400 });
    }

    // 更新或插入阅读进度
    await executeQuery({
      query: `
        INSERT INTO reading_progress (user_id, book_id, progress, updated_at)
        VALUES (?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
        progress = ?,
        updated_at = NOW()
      `,
      values: [session.user.id, bookId, progress, progress],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('更新阅读进度失败:', error);
    return NextResponse.json({ error: '更新失败' }, { status: 500 });
  }
}

// 获取阅读进度
export const GET = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');

    if (!bookId) {
      return NextResponse.json({ error: '无效的参数' }, { status: 400 });
    }

    const result = await executeQuery({
      query: `
        SELECT progress, updated_at
        FROM reading_progress
        WHERE user_id = ? AND book_id = ?
      `,
      values: [session.user.id, bookId],
    });

    if (Array.isArray(result) && result.length > 0) {
      return NextResponse.json(result[0]);
    }

    return NextResponse.json({ progress: 0 });
  } catch (error) {
    console.error('获取阅读进度失败:', error);
    return NextResponse.json({ error: '获取失败' }, { status: 500 });
  }
} 