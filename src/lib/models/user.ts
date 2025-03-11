import { executeQuery } from '../db';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import { Book } from './book';

// 用户类型定义
export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  avatar: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

// 用户书架类型定义
export interface UserBookshelf {
  id: number;
  user_id: number;
  book_id: number;
  reading_progress: number;
  last_read_at: string;
  created_at: string;
  updated_at: string;
  book?: Book;
  // 临时字段，用于从数据库查询结果映射
  title?: string;
  author?: string;
  cover_image?: string;
  rating?: number;
  category_id?: number;
  category_name?: string;
}

// 用户注册
export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<{ user: User | null; error?: string }> {
  try {
    // 检查用户名是否已存在
    const existingUsername = await executeQuery<any[]>({
      query: 'SELECT id FROM users WHERE username = ?',
      values: [username]
    });
    
    if (existingUsername.length > 0) {
      return { user: null, error: '用户名已被使用' };
    }
    
    // 检查邮箱是否已存在
    const existingEmail = await executeQuery<any[]>({
      query: 'SELECT id FROM users WHERE email = ?',
      values: [email]
    });
    
    if (existingEmail.length > 0) {
      return { user: null, error: '邮箱已被注册' };
    }
    
    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 创建用户
    const result = await executeQuery<any>({
      query: `
        INSERT INTO users (username, email, password)
        VALUES (?, ?, ?)
      `,
      values: [username, email, hashedPassword]
    });
    
    // 获取新创建的用户
    const users = await executeQuery<User[]>({
      query: 'SELECT id, username, email, avatar, bio, created_at, updated_at FROM users WHERE id = ?',
      values: [result.insertId]
    });
    
    return { user: users[0] };
  } catch (error) {
    console.error('用户注册失败:', error);
    return { user: null, error: '注册过程中发生错误' };
  }
}

// 用户登录
export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User | null; token?: string; error?: string }> {
  try {
    // 查找用户
    const users = await executeQuery<User[]>({
      query: 'SELECT * FROM users WHERE email = ?',
      values: [email]
    });
    
    if (users.length === 0) {
      return { user: null, error: '邮箱或密码不正确' };
    }
    
    const user = users[0];
    
    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      return { user: null, error: '邮箱或密码不正确' };
    }
    
    // 生成JWT令牌
    const signOptions: SignOptions = { expiresIn: config.jwt.expiresIn };
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      Buffer.from(config.jwt.secret),
      signOptions
    );
    
    // 移除密码
    delete user.password;
    
    return { user, token };
  } catch (error) {
    console.error('用户登录失败:', error);
    return { user: null, error: '登录过程中发生错误' };
  }
}

// 获取用户信息
export async function getUserById(id: number): Promise<User | null> {
  try {
    const users = await executeQuery<User[]>({
      query: 'SELECT id, username, email, avatar, bio, created_at, updated_at FROM users WHERE id = ?',
      values: [id]
    });
    
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
}

// 更新用户信息
export async function updateUserProfile(
  userId: number,
  data: { username?: string; bio?: string; avatar?: string }
): Promise<boolean> {
  try {
    const fields: string[] = [];
    const values: any[] = [];
    
    if (data.username) {
      fields.push('username = ?');
      values.push(data.username);
    }
    
    if (data.bio !== undefined) {
      fields.push('bio = ?');
      values.push(data.bio);
    }
    
    if (data.avatar !== undefined) {
      fields.push('avatar = ?');
      values.push(data.avatar);
    }
    
    if (fields.length === 0) {
      return true; // 没有要更新的字段
    }
    
    values.push(userId);
    
    await executeQuery({
      query: `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    });
    
    return true;
  } catch (error) {
    console.error('更新用户信息失败:', error);
    return false;
  }
}

// 更改密码
export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 获取用户当前密码
    const users = await executeQuery<User[]>({
      query: 'SELECT password FROM users WHERE id = ?',
      values: [userId]
    });
    
    if (users.length === 0) {
      return { success: false, error: '用户不存在' };
    }
    
    // 验证当前密码
    const isPasswordValid = await bcrypt.compare(currentPassword, users[0].password || '');
    if (!isPasswordValid) {
      return { success: false, error: '当前密码不正确' };
    }
    
    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // 更新密码
    await executeQuery({
      query: 'UPDATE users SET password = ? WHERE id = ?',
      values: [hashedPassword, userId]
    });
    
    return { success: true };
  } catch (error) {
    console.error('更改密码失败:', error);
    return { success: false, error: '更改密码过程中发生错误' };
  }
}

// 获取用户书架
export async function getUserBookshelf(userId: number): Promise<UserBookshelf[]> {
  try {
    const bookshelf = await executeQuery<UserBookshelf[]>({
      query: `
        SELECT ub.*, 
          b.title, b.author, b.cover_image, b.rating, b.category_id,
          c.name as category_name
        FROM user_bookshelves ub
        JOIN books b ON ub.book_id = b.id
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE ub.user_id = ?
        ORDER BY ub.last_read_at DESC
      `,
      values: [userId]
    });
    
    return bookshelf.map(item => ({
      ...item,
      book: {
        id: item.book_id,
        title: item.title || '',
        author: item.author || '',
        cover_image: item.cover_image || '',
        rating: item.rating || 0,
        category_id: item.category_id || 0,
        category_name: item.category_name
      } as Book
    }));
  } catch (error) {
    console.error('获取用户书架失败:', error);
    return [];
  }
}

// 添加书籍到书架
export async function addToBookshelf(userId: number, bookId: number): Promise<boolean> {
  try {
    // 检查是否已存在
    const existing = await executeQuery<any[]>({
      query: 'SELECT id FROM user_bookshelves WHERE user_id = ? AND book_id = ?',
      values: [userId, bookId]
    });
    
    if (existing.length > 0) {
      // 已存在，更新时间
      await executeQuery({
        query: 'UPDATE user_bookshelves SET last_read_at = CURRENT_TIMESTAMP WHERE id = ?',
        values: [existing[0].id]
      });
    } else {
      // 不存在，添加新记录
      await executeQuery({
        query: `
          INSERT INTO user_bookshelves (user_id, book_id, reading_progress, last_read_at)
          VALUES (?, ?, 0, CURRENT_TIMESTAMP)
        `,
        values: [userId, bookId]
      });
    }
    
    return true;
  } catch (error) {
    console.error('添加书籍到书架失败:', error);
    return false;
  }
}

// 从书架移除书籍
export async function removeFromBookshelf(userId: number, bookId: number): Promise<boolean> {
  try {
    await executeQuery({
      query: 'DELETE FROM user_bookshelves WHERE user_id = ? AND book_id = ?',
      values: [userId, bookId]
    });
    
    return true;
  } catch (error) {
    console.error('从书架移除书籍失败:', error);
    return false;
  }
}

// 获取用户阅读历史
export async function getUserReadingHistory(userId: number, limit = 10): Promise<any[]> {
  try {
    const query = `
      SELECT rh.*, 
        b.title, b.author, b.cover_image
      FROM reading_history rh
      JOIN books b ON rh.book_id = b.id
      WHERE rh.user_id = ?
      ORDER BY rh.read_at DESC
      LIMIT ?
    `;
    
    return await executeQuery<any[]>({ query, values: [userId, limit] });
  } catch (error) {
    console.error(`获取用户ID=${userId}的阅读历史失败:`, error);
    return [];
  }
}

// 根据邮箱获取用户
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const query = `
      SELECT *
      FROM users
      WHERE email = ?
    `;
    
    const results = await executeQuery<User[]>({ query, values: [email] });
    
    if (results.length === 0) {
      return null;
    }
    
    return results[0];
  } catch (error) {
    console.error(`获取邮箱=${email}的用户失败:`, error);
    return null;
  }
} 