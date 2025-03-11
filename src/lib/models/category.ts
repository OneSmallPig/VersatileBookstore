import { executeQuery } from '../db';

// 分类类型定义
export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  created_at: string;
  book_count?: number;
}

// 获取所有分类
export async function getAllCategories(): Promise<Category[]> {
  try {
    const categories = await executeQuery<Category[]>({
      query: `
        SELECT c.*, COUNT(b.id) as book_count
        FROM categories c
        LEFT JOIN books b ON c.id = b.category_id
        GROUP BY c.id
        ORDER BY c.name ASC
      `
    });
    
    return categories;
  } catch (error) {
    console.error('获取所有分类失败:', error);
    return [];
  }
}

// 获取热门分类
export async function getPopularCategories(limit: number = 6): Promise<Category[]> {
  try {
    const categories = await executeQuery<Category[]>({
      query: `
        SELECT c.*, COUNT(b.id) as book_count
        FROM categories c
        LEFT JOIN books b ON c.id = b.category_id
        GROUP BY c.id
        ORDER BY book_count DESC
        LIMIT ?
      `,
      values: [limit]
    });
    
    return categories;
  } catch (error) {
    console.error('获取热门分类失败:', error);
    return [];
  }
}

// 根据ID获取分类
export async function getCategoryById(id: number): Promise<Category | null> {
  try {
    const categories = await executeQuery<Category[]>({
      query: `
        SELECT c.*, COUNT(b.id) as book_count
        FROM categories c
        LEFT JOIN books b ON c.id = b.category_id
        WHERE c.id = ?
        GROUP BY c.id
      `,
      values: [id]
    });
    
    return categories.length > 0 ? categories[0] : null;
  } catch (error) {
    console.error('获取分类详情失败:', error);
    return null;
  }
}

// 根据名称获取分类
export async function getCategoryByName(name: string): Promise<Category | null> {
  try {
    const categories = await executeQuery<Category[]>({
      query: `
        SELECT c.*, COUNT(b.id) as book_count
        FROM categories c
        LEFT JOIN books b ON c.id = b.category_id
        WHERE c.name = ?
        GROUP BY c.id
      `,
      values: [name]
    });
    
    return categories.length > 0 ? categories[0] : null;
  } catch (error) {
    console.error('根据名称获取分类失败:', error);
    return null;
  }
}

// 根据分类获取书籍
export async function getBooksByCategory(categoryId: number, limit = 20): Promise<any[]> {
  try {
    const query = `
      SELECT b.*, 
        ROUND(b.rating, 1) as rating,
        c.name as category_name,
        GROUP_CONCAT(DISTINCT t.name) as tags
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN book_tags bt ON b.id = bt.book_id
      LEFT JOIN tags t ON bt.tag_id = t.id
      WHERE b.category_id = ?
      GROUP BY b.id
      LIMIT ?
    `;
    
    const books = await executeQuery<any[]>({ query, values: [categoryId, limit] });
    
    return books.map(book => ({
      ...book,
      tags: book.tags ? book.tags.split(',') : []
    }));
  } catch (error) {
    console.error(`获取分类ID=${categoryId}的书籍失败:`, error);
    return [];
  }
} 