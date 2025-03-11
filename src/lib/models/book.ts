import { executeQuery } from '../db';

// 书籍类型定义
export interface Book {
  id: number;
  title: string;
  author: string;
  cover_image: string;
  description: string;
  publication_date: string;
  publisher: string;
  isbn: string;
  page_count: number;
  rating: number;
  rating_count: number;
  category_id: number;
  category_name?: string;
  created_at: string;
  updated_at: string;
}

// 书籍内容类型定义
export interface BookContent {
  id: number;
  book_id: number;
  chapter_number: number;
  chapter_title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// 获取推荐书籍
export async function getRecommendedBooks(limit: number = 10): Promise<Book[]> {
  try {
    const books = await executeQuery<Book[]>({
      query: `
        SELECT b.*, c.name as category_name
        FROM books b
        LEFT JOIN categories c ON b.category_id = c.id
        ORDER BY b.rating DESC, b.rating_count DESC
        LIMIT ?
      `,
      values: [limit]
    });
    
    return books;
  } catch (error) {
    console.error('获取推荐书籍失败:', error);
    return [];
  }
}

// 获取最新书籍
export async function getNewBooks(limit: number = 10): Promise<Book[]> {
  try {
    const books = await executeQuery<Book[]>({
      query: `
        SELECT b.*, c.name as category_name
        FROM books b
        LEFT JOIN categories c ON b.category_id = c.id
        ORDER BY b.created_at DESC
        LIMIT ?
      `,
      values: [limit]
    });
    
    return books;
  } catch (error) {
    console.error('获取最新书籍失败:', error);
    return [];
  }
}

// 获取书籍详情
export async function getBookById(id: number): Promise<Book | null> {
  try {
    const books = await executeQuery<Book[]>({
      query: `
        SELECT b.*, c.name as category_name
        FROM books b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE b.id = ?
      `,
      values: [id]
    });
    
    return books.length > 0 ? books[0] : null;
  } catch (error) {
    console.error('获取书籍详情失败:', error);
    return null;
  }
}

// 获取书籍章节列表
export async function getBookChapters(bookId: number): Promise<BookContent[]> {
  try {
    const chapters = await executeQuery<BookContent[]>({
      query: `
        SELECT *
        FROM book_contents
        WHERE book_id = ?
        ORDER BY chapter_number ASC
      `,
      values: [bookId]
    });
    
    return chapters;
  } catch (error) {
    console.error('获取书籍章节列表失败:', error);
    return [];
  }
}

// 获取书籍章节内容
export async function getChapterContent(bookId: number, chapterNumber: number): Promise<BookContent | null> {
  try {
    const chapters = await executeQuery<BookContent[]>({
      query: `
        SELECT *
        FROM book_contents
        WHERE book_id = ? AND chapter_number = ?
      `,
      values: [bookId, chapterNumber]
    });
    
    return chapters.length > 0 ? chapters[0] : null;
  } catch (error) {
    console.error('获取章节内容失败:', error);
    return null;
  }
}

// 搜索书籍
export async function searchBooks(query: string, limit: number = 20): Promise<Book[]> {
  try {
    const books = await executeQuery<Book[]>({
      query: `
        SELECT b.*, c.name as category_name
        FROM books b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE 
          b.title LIKE ? OR 
          b.author LIKE ? OR 
          b.description LIKE ?
        ORDER BY 
          CASE 
            WHEN b.title LIKE ? THEN 1
            WHEN b.author LIKE ? THEN 2
            ELSE 3
          END,
          b.rating DESC
        LIMIT ?
      `,
      values: [
        `%${query}%`, 
        `%${query}%`, 
        `%${query}%`,
        `%${query}%`,
        `%${query}%`,
        limit
      ]
    });
    
    return books;
  } catch (error) {
    console.error('搜索书籍失败:', error);
    return [];
  }
}

// 按分类获取书籍
export async function getBooksByCategory(categoryId: number, limit: number = 20): Promise<Book[]> {
  try {
    const books = await executeQuery<Book[]>({
      query: `
        SELECT b.*, c.name as category_name
        FROM books b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE b.category_id = ?
        ORDER BY b.rating DESC
        LIMIT ?
      `,
      values: [categoryId, limit]
    });
    
    return books;
  } catch (error) {
    console.error('按分类获取书籍失败:', error);
    return [];
  }
}

// 按标签获取书籍
export async function getBooksByTag(tagId: number, limit: number = 20): Promise<Book[]> {
  try {
    const books = await executeQuery<Book[]>({
      query: `
        SELECT b.*, c.name as category_name
        FROM books b
        LEFT JOIN categories c ON b.category_id = c.id
        JOIN book_tags bt ON b.id = bt.book_id
        WHERE bt.tag_id = ?
        ORDER BY b.rating DESC
        LIMIT ?
      `,
      values: [tagId, limit]
    });
    
    return books;
  } catch (error) {
    console.error('按标签获取书籍失败:', error);
    return [];
  }
}

// 获取书籍的标签
export async function getBookTags(bookId: number): Promise<{ id: number; name: string }[]> {
  try {
    const tags = await executeQuery<{ id: number; name: string }[]>({
      query: `
        SELECT t.id, t.name
        FROM tags t
        JOIN book_tags bt ON t.id = bt.tag_id
        WHERE bt.book_id = ?
      `,
      values: [bookId]
    });
    
    return tags;
  } catch (error) {
    console.error('获取书籍标签失败:', error);
    return [];
  }
}

// 更新阅读进度
export async function updateReadingProgress(userId: number, bookId: number, progress: number): Promise<boolean> {
  try {
    // 检查是否已存在记录
    const existingRecords = await executeQuery<any[]>({
      query: 'SELECT id FROM user_bookshelves WHERE user_id = ? AND book_id = ?',
      values: [userId, bookId]
    });
    
    if (existingRecords.length > 0) {
      // 更新现有记录
      await executeQuery({
        query: `
          UPDATE user_bookshelves 
          SET reading_progress = ?, last_read_at = CURRENT_TIMESTAMP
          WHERE user_id = ? AND book_id = ?
        `,
        values: [progress, userId, bookId]
      });
    } else {
      // 创建新记录
      await executeQuery({
        query: `
          INSERT INTO user_bookshelves (user_id, book_id, reading_progress, last_read_at)
          VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        `,
        values: [userId, bookId, progress]
      });
    }
    
    return true;
  } catch (error) {
    console.error('更新阅读进度失败:', error);
    return false;
  }
} 