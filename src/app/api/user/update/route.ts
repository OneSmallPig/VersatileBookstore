import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export const PUT = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const { username, email, currentPassword, newPassword } = await request.json();
    
    // 验证必填字段
    if (!username || !email) {
      return NextResponse.json({ error: '用户名和邮箱为必填项' }, { status: 400 });
    }

    // 检查邮箱是否已被其他用户使用
    const existingUsers = await executeQuery({
      query: 'SELECT id FROM users WHERE email = ? AND id != ?',
      values: [email, session.user.id],
    });

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return NextResponse.json({ error: '该邮箱已被使用' }, { status: 400 });
    }

    // 如果要更改密码，验证当前密码
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: '请输入当前密码' }, { status: 400 });
      }

      const user = await executeQuery({
        query: 'SELECT password FROM users WHERE id = ?',
        values: [session.user.id],
      });

      if (!Array.isArray(user) || user.length === 0) {
        return NextResponse.json({ error: '用户不存在' }, { status: 404 });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user[0].password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: '当前密码错误' }, { status: 400 });
      }
    }

    // 构建更新语句
    let query = 'UPDATE users SET username = ?, email = ?';
    const values = [username, email];

    // 如果有新密码，添加到更新语句中
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      query += ', password = ?';
      values.push(hashedPassword);
    }

    query += ' WHERE id = ?';
    values.push(session.user.id);

    // 执行更新
    await executeQuery({
      query,
      values,
    });

    return NextResponse.json({ 
      success: true,
      user: {
        id: session.user.id,
        username,
        email,
      }
    });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    return NextResponse.json({ error: '更新失败' }, { status: 500 });
  }
} 