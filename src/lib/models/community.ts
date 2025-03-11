import { executeQuery } from '../db';

// 帖子类型定义
export interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  book_id: number | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  username?: string;
  avatar?: string;
  book_title?: string;
  book_cover?: string;
  is_liked?: boolean;
}

// 评论类型定义
export interface Comment {
  id: number;
  user_id: number;
  post_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  username?: string;
  avatar?: string;
}

// 获取社区帖子
export async function getCommunityPosts(limit: number = 10, offset: number = 0): Promise<Post[]> {
  try {
    const posts = await executeQuery<Post[]>({
      query: `
        SELECT 
          p.*,
          u.username,
          u.avatar,
          b.title as book_title,
          b.cover_image as book_cover
        FROM posts p
        JOIN users u ON p.user_id = u.id
        LEFT JOIN books b ON p.book_id = b.id
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
      `,
      values: [limit, offset]
    });
    
    return posts;
  } catch (error) {
    console.error('获取社区帖子失败:', error);
    return [];
  }
}

// 获取帖子详情
export async function getPostById(id: number, userId?: number): Promise<Post | null> {
  try {
    const posts = await executeQuery<Post[]>({
      query: `
        SELECT 
          p.*,
          u.username,
          u.avatar,
          b.title as book_title,
          b.cover_image as book_cover,
          ${userId ? `(SELECT COUNT(*) > 0 FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked` : 'FALSE as is_liked'}
        FROM posts p
        JOIN users u ON p.user_id = u.id
        LEFT JOIN books b ON p.book_id = b.id
        WHERE p.id = ?
      `,
      values: userId ? [userId, id] : [id]
    });
    
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error('获取帖子详情失败:', error);
    return null;
  }
}

// 获取帖子评论
export async function getPostComments(postId: number): Promise<Comment[]> {
  try {
    const comments = await executeQuery<Comment[]>({
      query: `
        SELECT 
          c.*,
          u.username,
          u.avatar
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = ?
        ORDER BY c.created_at ASC
      `,
      values: [postId]
    });
    
    return comments;
  } catch (error) {
    console.error('获取帖子评论失败:', error);
    return [];
  }
}

// 创建帖子
export async function createPost(
  userId: number, 
  title: string, 
  content: string, 
  bookId?: number
): Promise<number | null> {
  try {
    const result = await executeQuery<any>({
      query: `
        INSERT INTO posts (user_id, title, content, book_id)
        VALUES (?, ?, ?, ?)
      `,
      values: [userId, title, content, bookId || null]
    });
    
    return result.insertId;
  } catch (error) {
    console.error('创建帖子失败:', error);
    return null;
  }
}

// 添加评论
export async function addComment(
  userId: number, 
  postId: number, 
  content: string
): Promise<number | null> {
  try {
    // 添加评论
    const result = await executeQuery<any>({
      query: `
        INSERT INTO comments (user_id, post_id, content)
        VALUES (?, ?, ?)
      `,
      values: [userId, postId, content]
    });
    
    // 更新帖子评论数
    await executeQuery({
      query: `
        UPDATE posts
        SET comments_count = comments_count + 1
        WHERE id = ?
      `,
      values: [postId]
    });
    
    return result.insertId;
  } catch (error) {
    console.error('添加评论失败:', error);
    return null;
  }
}

// 点赞帖子
export async function likePost(userId: number, postId: number): Promise<boolean> {
  try {
    // 检查是否已点赞
    const existingLikes = await executeQuery<any[]>({
      query: 'SELECT id FROM likes WHERE user_id = ? AND post_id = ?',
      values: [userId, postId]
    });
    
    if (existingLikes.length > 0) {
      // 已点赞，取消点赞
      await executeQuery({
        query: 'DELETE FROM likes WHERE user_id = ? AND post_id = ?',
        values: [userId, postId]
      });
      
      // 更新帖子点赞数
      await executeQuery({
        query: 'UPDATE posts SET likes_count = likes_count - 1 WHERE id = ?',
        values: [postId]
      });
      
      return false; // 返回当前状态：未点赞
    } else {
      // 未点赞，添加点赞
      await executeQuery({
        query: 'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
        values: [userId, postId]
      });
      
      // 更新帖子点赞数
      await executeQuery({
        query: 'UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?',
        values: [postId]
      });
      
      return true; // 返回当前状态：已点赞
    }
  } catch (error) {
    console.error('点赞帖子失败:', error);
    throw error;
  }
}

// 获取用户的帖子
export async function getUserPosts(userId: number): Promise<Post[]> {
  try {
    const posts = await executeQuery<Post[]>({
      query: `
        SELECT 
          p.*,
          u.username,
          u.avatar,
          b.title as book_title,
          b.cover_image as book_cover
        FROM posts p
        JOIN users u ON p.user_id = u.id
        LEFT JOIN books b ON p.book_id = b.id
        WHERE p.user_id = ?
        ORDER BY p.created_at DESC
      `,
      values: [userId]
    });
    
    return posts;
  } catch (error) {
    console.error('获取用户帖子失败:', error);
    return [];
  }
} 