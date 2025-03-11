import { executeQuery } from './db';
import bcrypt from 'bcrypt';

// 初始化数据库
export async function initializeDatabase() {
  try {
    console.log('开始初始化数据库...');
    
    // 创建用户
    await createUsers();
    
    // 创建分类
    await createCategories();
    
    // 创建标签
    await createTags();
    
    // 创建书籍
    await createBooks();
    
    // 创建书籍内容
    await createBookContents();
    
    // 创建书籍标签关联
    await createBookTags();
    
    // 创建用户书架
    await createUserBookshelves();
    
    // 创建社区帖子
    await createPosts();
    
    // 创建评论
    await createComments();
    
    // 创建点赞
    await createLikes();
    
    console.log('数据库初始化完成！');
  } catch (error) {
    console.error('数据库初始化失败:', error);
  }
}

// 创建用户
async function createUsers() {
  try {
    // 检查是否已有用户
    const users = await executeQuery<any[]>({ query: 'SELECT * FROM users LIMIT 1' });
    if (users.length > 0) {
      console.log('用户数据已存在，跳过创建');
      return;
    }
    
    console.log('创建用户数据...');
    
    // 创建管理员用户
    const adminPassword = await bcrypt.hash('admin123', 10);
    await executeQuery({
      query: `
        INSERT INTO users (username, email, password, avatar, bio)
        VALUES (?, ?, ?, ?, ?)
      `,
      values: ['admin', 'admin@example.com', adminPassword, null, '系统管理员']
    });
    
    // 创建测试用户
    const testPassword = await bcrypt.hash('test123', 10);
    await executeQuery({
      query: `
        INSERT INTO users (username, email, password, avatar, bio)
        VALUES (?, ?, ?, ?, ?)
      `,
      values: ['test', 'test@example.com', testPassword, null, '测试用户']
    });
    
    console.log('用户数据创建完成');
  } catch (error) {
    console.error('创建用户失败:', error);
    throw error;
  }
}

// 创建分类
async function createCategories() {
  try {
    // 检查是否已有分类
    const categories = await executeQuery<any[]>({ query: 'SELECT * FROM categories LIMIT 1' });
    if (categories.length > 0) {
      console.log('分类数据已存在，跳过创建');
      return;
    }
    
    console.log('创建分类数据...');
    
    const categoryData = [
      { name: '计算机科学', icon: 'laptop-code', color: 'blue' },
      { name: '科学', icon: 'flask', color: 'green' },
      { name: '心理学', icon: 'brain', color: 'purple' },
      { name: '历史', icon: 'landmark', color: 'yellow' },
      { name: '文学', icon: 'book-open', color: 'red' },
      { name: '经济学', icon: 'chart-line', color: 'indigo' }
    ];
    
    for (const category of categoryData) {
      await executeQuery({
        query: `
          INSERT INTO categories (name, icon, color)
          VALUES (?, ?, ?)
        `,
        values: [category.name, category.icon, category.color]
      });
    }
    
    console.log('分类数据创建完成');
  } catch (error) {
    console.error('创建分类失败:', error);
    throw error;
  }
}

// 创建标签
async function createTags() {
  try {
    // 检查是否已有标签
    const tags = await executeQuery<any[]>({ query: 'SELECT * FROM tags LIMIT 1' });
    if (tags.length > 0) {
      console.log('标签数据已存在，跳过创建');
      return;
    }
    
    console.log('创建标签数据...');
    
    const tagData = [
      '人工智能', '计算机科学', '科学', '心理学', '历史', '文学', '经济学',
      '自我提升', '人类学', '未来学', '科技', '行为经济学', '学习方法',
      '思维方式', '沟通技巧', '营销'
    ];
    
    for (const tag of tagData) {
      await executeQuery({
        query: 'INSERT INTO tags (name) VALUES (?)',
        values: [tag]
      });
    }
    
    console.log('标签数据创建完成');
  } catch (error) {
    console.error('创建标签失败:', error);
    throw error;
  }
}

// 创建书籍
async function createBooks() {
  try {
    // 检查是否已有书籍
    const books = await executeQuery<any[]>({ query: 'SELECT * FROM books LIMIT 1' });
    if (books.length > 0) {
      console.log('书籍数据已存在，跳过创建');
      return;
    }
    
    console.log('创建书籍数据...');
    
    // 获取分类ID
    const categories = await executeQuery<any[]>({ query: 'SELECT id, name FROM categories' });
    const categoryMap = new Map();
    categories.forEach(category => {
      categoryMap.set(category.name, category.id);
    });
    
    const bookData = [
      {
        title: '深度学习',
        author: '伊恩·古德费洛',
        cover_image: '/images/book-covers/deep-learning.svg',
        description: '这是AI领域的经典之作，由三位深度学习领域的专家撰写。本书系统地介绍了深度学习的基本原理、数学基础和实际应用，是入门人工智能必读的权威教材。',
        publication_date: '2016-11-18',
        publisher: 'MIT Press',
        isbn: '9780262035613',
        page_count: 800,
        rating: 4.8,
        rating_count: 1200,
        category_id: categoryMap.get('计算机科学')
      },
      {
        title: '人类简史',
        author: '尤瓦尔·赫拉利',
        cover_image: '/images/book-covers/history-book.svg',
        description: '从十万年前有生命迹象开始，赫拉利带领读者跨越整个人类历史。这部全球现象级的畅销书，讲述了我们如何从狩猎采集者发展为当今世界的主宰者。',
        publication_date: '2014-02-10',
        publisher: '中信出版社',
        isbn: '9787508647357',
        page_count: 440,
        rating: 4.7,
        rating_count: 2500,
        category_id: categoryMap.get('历史')
      },
      {
        title: '未来简史',
        author: '尤瓦尔·赫拉利',
        cover_image: '/images/book-covers/future-book.svg',
        description: '继《人类简史》之后，赫拉利的又一力作。本书探讨了人类面临的未来挑战，从人工智能到生物工程，思考人类将如何应对这些变革以及我们的命运将走向何方。',
        publication_date: '2017-02-21',
        publisher: '中信出版社',
        isbn: '9787508672069',
        page_count: 384,
        rating: 4.6,
        rating_count: 1800,
        category_id: categoryMap.get('科学')
      },
      {
        title: '思考，快与慢',
        author: '丹尼尔·卡尼曼',
        cover_image: '/images/book-covers/psychology-book.svg',
        description: '诺贝尔经济学奖得主卡尼曼的代表作，揭示了人类思维的两种模式：快速、直觉的"系统1"和缓慢、理性的"系统2"，以及它们如何塑造我们的判断和决策。',
        publication_date: '2011-10-25',
        publisher: '中信出版社',
        isbn: '9787508633558',
        page_count: 418,
        rating: 4.9,
        rating_count: 3000,
        category_id: categoryMap.get('心理学')
      },
      {
        title: '原子习惯',
        author: '詹姆斯·克利尔',
        cover_image: '/images/book-covers/atomic-habits.svg',
        description: '这本书揭示了养成好习惯和打破坏习惯的实用框架。通过微小的改变，你可以获得惊人的结果。克利尔提供了简单而有效的方法，帮助你建立持久的好习惯。',
        publication_date: '2018-10-16',
        publisher: '中信出版社',
        isbn: '9787521700800',
        page_count: 320,
        rating: 5.0,
        rating_count: 2200,
        category_id: categoryMap.get('心理学')
      },
      {
        title: '刻意练习',
        author: '安德斯·艾利克森',
        cover_image: '/images/book-covers/deliberate-practice.svg',
        description: '本书揭示了卓越表现背后的秘密：刻意练习。作者通过研究顶尖表现者，发现天才并非天生，而是通过特定类型的练习——刻意练习——来实现的。',
        publication_date: '2016-08-16',
        publisher: '机械工业出版社',
        isbn: '9787111555018',
        page_count: 304,
        rating: 4.0,
        rating_count: 1500,
        category_id: categoryMap.get('心理学')
      },
      {
        title: '金字塔原理',
        author: '芭芭拉·明托',
        cover_image: '/images/book-covers/default-book.svg',
        description: '这本经典著作教你如何清晰地思考和表达。金字塔原理是一种逻辑思维方法，帮助你构建有说服力的论点，使复杂的想法变得简单易懂，是商业写作和演讲的必备工具。',
        publication_date: '2002-09-01',
        publisher: '民主与建设出版社',
        isbn: '9787801126771',
        page_count: 272,
        rating: 4.5,
        rating_count: 1800,
        category_id: categoryMap.get('经济学')
      },
      {
        title: '影响力',
        author: '罗伯特·西奥迪尼',
        cover_image: '/images/book-covers/default-book.svg',
        description: '西奥迪尼博士揭示了说服他人的六大心理原则：互惠、承诺和一致、社会认同、喜好、权威和稀缺。这本书帮助你理解为什么人们会说"是"，以及如何应用这些原则。',
        publication_date: '2006-08-08',
        publisher: '中国人民大学出版社',
        isbn: '9787300085852',
        page_count: 320,
        rating: 4.7,
        rating_count: 2100,
        category_id: categoryMap.get('心理学')
      }
    ];
    
    for (const book of bookData) {
      await executeQuery({
        query: `
          INSERT INTO books (
            title, author, cover_image, description, publication_date, 
            publisher, isbn, page_count, rating, rating_count, category_id
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        values: [
          book.title, book.author, book.cover_image, book.description, book.publication_date,
          book.publisher, book.isbn, book.page_count, book.rating, book.rating_count, book.category_id
        ]
      });
    }
    
    console.log('书籍数据创建完成');
  } catch (error) {
    console.error('创建书籍失败:', error);
    throw error;
  }
}

// 创建书籍内容
async function createBookContents() {
  try {
    // 检查是否已有书籍内容
    const contents = await executeQuery<any[]>({ query: 'SELECT * FROM book_contents LIMIT 1' });
    if (contents.length > 0) {
      console.log('书籍内容数据已存在，跳过创建');
      return;
    }
    
    console.log('创建书籍内容数据...');
    
    // 获取所有书籍
    const books = await executeQuery<any[]>({ query: 'SELECT id, title FROM books' });
    
    for (const book of books) {
      // 为每本书创建3个章节
      for (let i = 1; i <= 3; i++) {
        await executeQuery({
          query: `
            INSERT INTO book_contents (book_id, chapter_number, chapter_title, content)
            VALUES (?, ?, ?, ?)
          `,
          values: [
            book.id,
            i,
            `第${i}章：${book.title}的${i === 1 ? '介绍' : i === 2 ? '核心内容' : '实践应用'}`,
            `这是《${book.title}》的第${i}章内容。这里是示例文本，实际内容会更加丰富和详细。\n\n这是第二段落，用于展示章节内容的格式。在实际应用中，这里会包含完整的章节内容，包括文字、段落、引用等。\n\n这是第三段落，继续补充章节内容。一本书的章节通常包含多个段落，每个段落都有其特定的主题和内容。`
          ]
        });
      }
    }
    
    console.log('书籍内容数据创建完成');
  } catch (error) {
    console.error('创建书籍内容失败:', error);
    throw error;
  }
}

// 创建书籍标签关联
async function createBookTags() {
  try {
    // 检查是否已有书籍标签关联
    const bookTags = await executeQuery<any[]>({ query: 'SELECT * FROM book_tags LIMIT 1' });
    if (bookTags.length > 0) {
      console.log('书籍标签关联数据已存在，跳过创建');
      return;
    }
    
    console.log('创建书籍标签关联数据...');
    
    // 获取所有书籍
    const books = await executeQuery<any[]>({ query: 'SELECT id, title FROM books' });
    
    // 获取所有标签
    const tags = await executeQuery<any[]>({ query: 'SELECT id, name FROM tags' });
    const tagMap = new Map();
    tags.forEach(tag => {
      tagMap.set(tag.name, tag.id);
    });
    
    // 为每本书分配标签
    const bookTagsData = [
      { title: '深度学习', tags: ['人工智能', '计算机科学'] },
      { title: '人类简史', tags: ['历史', '人类学'] },
      { title: '未来简史', tags: ['未来学', '科技'] },
      { title: '思考，快与慢', tags: ['心理学', '行为经济学'] },
      { title: '原子习惯', tags: ['自我提升', '心理学'] },
      { title: '刻意练习', tags: ['自我提升', '学习方法'] },
      { title: '金字塔原理', tags: ['思维方式', '沟通技巧'] },
      { title: '影响力', tags: ['心理学', '营销'] }
    ];
    
    for (const bookTag of bookTagsData) {
      const book = books.find(b => b.title === bookTag.title);
      if (book) {
        for (const tagName of bookTag.tags) {
          const tagId = tagMap.get(tagName);
          if (tagId) {
            await executeQuery({
              query: 'INSERT INTO book_tags (book_id, tag_id) VALUES (?, ?)',
              values: [book.id, tagId]
            });
          }
        }
      }
    }
    
    console.log('书籍标签关联数据创建完成');
  } catch (error) {
    console.error('创建书籍标签关联失败:', error);
    throw error;
  }
}

// 创建用户书架
async function createUserBookshelves() {
  try {
    // 检查是否已有用户书架
    const bookshelves = await executeQuery<any[]>({ query: 'SELECT * FROM user_bookshelves LIMIT 1' });
    if (bookshelves.length > 0) {
      console.log('用户书架数据已存在，跳过创建');
      return;
    }
    
    console.log('创建用户书架数据...');
    
    // 获取用户
    const users = await executeQuery<any[]>({ query: 'SELECT id FROM users' });
    
    // 获取书籍
    const books = await executeQuery<any[]>({ query: 'SELECT id FROM books' });
    
    // 为每个用户添加一些书籍到书架
    for (const user of users) {
      // 随机选择4本书
      const selectedBooks = books.sort(() => 0.5 - Math.random()).slice(0, 4);
      
      for (const book of selectedBooks) {
        // 随机阅读进度
        const progress = Math.floor(Math.random() * 100);
        
        await executeQuery({
          query: `
            INSERT INTO user_bookshelves (user_id, book_id, reading_progress, last_read_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
          `,
          values: [user.id, book.id, progress]
        });
      }
    }
    
    console.log('用户书架数据创建完成');
  } catch (error) {
    console.error('创建用户书架失败:', error);
    throw error;
  }
}

// 创建社区帖子
async function createPosts() {
  try {
    // 检查是否已有帖子
    const posts = await executeQuery<any[]>({ query: 'SELECT * FROM posts LIMIT 1' });
    if (posts.length > 0) {
      console.log('社区帖子数据已存在，跳过创建');
      return;
    }
    
    console.log('创建社区帖子数据...');
    
    // 获取用户
    const users = await executeQuery<any[]>({ query: 'SELECT id FROM users' });
    
    // 获取书籍
    const books = await executeQuery<any[]>({ query: 'SELECT id, title FROM books' });
    
    const postData = [
      {
        title: '推荐一本AI领域的经典书籍',
        content: '最近读了《深度学习》这本书，感觉非常棒！这本书是AI领域的经典之作，详细介绍了深度学习的基本原理和应用。对于想入门AI的朋友来说，是必读书目！',
        book_title: '深度学习'
      },
      {
        title: '这本书改变了我的生活习惯',
        content: '《原子习惯》这本书改变了我的生活！通过微小的改变，养成好习惯，最终实现巨大的成果。强烈推荐给每一个想要提升自己的人。',
        book_title: '原子习惯'
      },
      {
        title: '关于人类历史的思考',
        content: '读完《人类简史》，对人类的历史有了全新的认识。从狩猎采集时代到信息时代，人类经历了怎样的变革？这本书给了我很多启发。',
        book_title: '人类简史'
      },
      {
        title: '思维模式的转变',
        content: '《思考，快与慢》让我了解到人类思维的两种模式。我们的大脑如何工作？为什么我们会做出某些决策？这本书值得每个人阅读。',
        book_title: '思考，快与慢'
      }
    ];
    
    for (let i = 0; i < postData.length; i++) {
      const post = postData[i];
      const userId = users[i % users.length].id;
      const book = books.find(b => b.title === post.book_title);
      
      await executeQuery({
        query: `
          INSERT INTO posts (user_id, title, content, book_id, likes_count, comments_count)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        values: [userId, post.title, post.content, book ? book.id : null, Math.floor(Math.random() * 50), Math.floor(Math.random() * 20)]
      });
    }
    
    console.log('社区帖子数据创建完成');
  } catch (error) {
    console.error('创建社区帖子失败:', error);
    throw error;
  }
}

// 创建评论
async function createComments() {
  try {
    // 检查是否已有评论
    const comments = await executeQuery<any[]>({ query: 'SELECT * FROM comments LIMIT 1' });
    if (comments.length > 0) {
      console.log('评论数据已存在，跳过创建');
      return;
    }
    
    console.log('创建评论数据...');
    
    // 获取用户
    const users = await executeQuery<any[]>({ query: 'SELECT id FROM users' });
    
    // 获取帖子
    const posts = await executeQuery<any[]>({ query: 'SELECT id FROM posts' });
    
    const commentContents = [
      '非常同意你的观点！',
      '这本书我也读过，确实很棒！',
      '谢谢推荐，我会去看看的。',
      '你对这本书的理解很深刻。',
      '这个观点很有启发性。',
      '我有不同的看法，但你的分析很有道理。',
      '这本书改变了我的思维方式。',
      '我也很喜欢这本书，尤其是第三章的内容。'
    ];
    
    for (const post of posts) {
      // 为每个帖子添加2-5条评论
      const commentCount = Math.floor(Math.random() * 4) + 2;
      
      for (let i = 0; i < commentCount; i++) {
        const userId = users[Math.floor(Math.random() * users.length)].id;
        const content = commentContents[Math.floor(Math.random() * commentContents.length)];
        
        await executeQuery({
          query: 'INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)',
          values: [userId, post.id, content]
        });
      }
      
      // 更新帖子的评论数
      await executeQuery({
        query: 'UPDATE posts SET comments_count = ? WHERE id = ?',
        values: [commentCount, post.id]
      });
    }
    
    console.log('评论数据创建完成');
  } catch (error) {
    console.error('创建评论失败:', error);
    throw error;
  }
}

// 创建点赞
async function createLikes() {
  try {
    // 检查是否已有点赞
    const likes = await executeQuery<any[]>({ query: 'SELECT * FROM likes LIMIT 1' });
    if (likes.length > 0) {
      console.log('点赞数据已存在，跳过创建');
      return;
    }
    
    console.log('创建点赞数据...');
    
    // 获取用户
    const users = await executeQuery<any[]>({ query: 'SELECT id FROM users' });
    
    // 获取帖子
    const posts = await executeQuery<any[]>({ query: 'SELECT id FROM posts' });
    
    for (const post of posts) {
      // 为每个帖子添加一些点赞
      const likeCount = Math.floor(Math.random() * 30) + 5;
      
      // 随机选择用户进行点赞
      const likedUsers = users.sort(() => 0.5 - Math.random()).slice(0, likeCount);
      
      for (const user of likedUsers) {
        await executeQuery({
          query: 'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
          values: [user.id, post.id]
        });
      }
      
      // 更新帖子的点赞数
      await executeQuery({
        query: 'UPDATE posts SET likes_count = ? WHERE id = ?',
        values: [likeCount, post.id]
      });
    }
    
    console.log('点赞数据创建完成');
  } catch (error) {
    console.error('创建点赞失败:', error);
    throw error;
  }
} 