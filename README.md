# 百变书屋 - 私人智能图书馆

一个现代化的私人图书馆网站，结合AI技术，为用户提供智能书籍推荐和免费阅读资源。

## 技术栈

- **前端**：Next.js 15.2.1、React 19、TypeScript、Tailwind CSS
- **后端**：Next.js API Routes
- **数据库**：MySQL
- **认证**：JWT (JSON Web Token)

## 功能特点

- 📚 智能书籍推荐
- 🔍 强大的搜索功能
- 📖 在线阅读体验
- 📋 个人书架管理
- 👥 社区交流与分享
- 🌈 美观的UI设计

## 项目结构

```
src/
├── app/                # App Router 路由和页面组件
│   ├── api/            # API 路由
│   ├── auth/           # 认证相关页面
│   ├── book/           # 书籍详情页
│   ├── bookshelf/      # 个人书架页
│   ├── community/      # 社区页面
│   ├── profile/        # 用户资料页
│   ├── search/         # 搜索页面
│   ├── globals.css     # 全局样式
│   ├── layout.tsx      # 根布局组件
│   └── page.tsx        # 首页
├── components/         # 可复用的 React 组件
│   ├── layout/         # 布局组件
│   └── ui/             # UI 组件
├── lib/                # 工具函数和通用库
│   ├── models/         # 数据模型
│   ├── config.ts       # 配置文件
│   ├── db.ts           # 数据库连接
│   ├── init.ts         # 初始化脚本
│   └── init-db.ts      # 数据库初始化
└── public/             # 静态资源
    └── images/         # 图片资源
```

## API 接口

### 书籍相关

- `GET /api/books` - 获取书籍列表
- `GET /api/books/[id]` - 获取书籍详情
- `GET /api/books/[id]/chapters/[chapter]` - 获取书籍章节内容

### 分类相关

- `GET /api/categories` - 获取分类列表

### 社区相关

- `GET /api/community` - 获取社区帖子列表
- `GET /api/community/[id]` - 获取帖子详情

### 用户相关

- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `GET /api/user` - 获取用户信息
- `POST /api/user/update` - 更新用户信息
- `POST /api/user/change-password` - 更改密码

### 书架相关

- `GET /api/bookshelf` - 获取用户书架
- `POST /api/bookshelf` - 添加书籍到书架
- `POST /api/bookshelf/remove` - 从书架中移除书籍
- `POST /api/bookshelf/progress` - 更新阅读进度

### 系统相关

- `GET /api/init` - 初始化数据库

## 快速开始

1. 安装依赖：
```bash
npm install
```

2. 配置环境变量：
创建 `.env.local` 文件，添加以下内容：
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=versatile_bookstore
JWT_SECRET=your_secret_key
```

3. 初始化数据库：
```bash
# 先创建数据库
mysql -u root -p -e "CREATE DATABASE versatile_bookstore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 然后启动应用并访问初始化接口
npm run dev
# 在浏览器中访问 http://localhost:3000/api/init
```

4. 启动开发服务器：
```bash
npm run dev
```

5. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 部署

构建生产版本：
```bash
npm run build
```

运行生产版本：
```bash
npm start
```

## 许可证

MIT
