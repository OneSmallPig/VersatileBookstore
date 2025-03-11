import Link from 'next/link';
import Image from 'next/image';
import BookCard from '@/components/ui/BookCard';
import CategoryCard from '@/components/ui/CategoryCard';
import { getRecommendedBooks, getNewBooks } from '@/lib/models/book';
import { getPopularCategories } from '@/lib/models/category';
import { getCommunityPosts } from '@/lib/models/community';

export default async function Home() {
  // 获取数据
  const recommendedBooks = await getRecommendedBooks(4);
  const newBooks = await getNewBooks(4);
  const categories = await getPopularCategories(6);
  const communityPosts = await getCommunityPosts(2);
  
  return (
    <>
      {/* 欢迎横幅 */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">欢迎来到您的私人图书馆</h1>
            <p className="mb-4">通过AI智能推荐，发现适合您的书籍，并获取免费阅读资源。</p>
            <div className="flex space-x-4">
              <Link href="/search" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition">
                <i className="fas fa-search mr-2"></i>智能搜索
              </Link>
              <Link href="/bookshelf" className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition">
                <i className="fas fa-book mr-2"></i>我的书架
              </Link>
            </div>
          </div>
          <div className="md:w-1/3 mt-6 md:mt-0 flex justify-center">
            <Image src="/images/bookshelf.svg" alt="书架" width={160} height={160} />
          </div>
        </div>
      </section>
      
      {/* 为您推荐 */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">为您推荐</h2>
          <Link href="/search?type=recommended" className="text-blue-500 text-sm flex items-center">
            查看全部 <i className="fas fa-chevron-right ml-1 text-xs"></i>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
      
      {/* 热门分类 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">热门分类</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
      
      {/* 最近更新 */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">最近更新</h2>
          <Link href="/search?type=new" className="text-blue-500 text-sm flex items-center">
            查看全部 <i className="fas fa-chevron-right ml-1 text-xs"></i>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
      
      {/* 社区推荐 */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">社区推荐</h2>
          <Link href="/community" className="text-blue-500 text-sm flex items-center">
            前往社区 <i className="fas fa-chevron-right ml-1 text-xs"></i>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {communityPosts.map(post => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex-shrink-0 flex items-center justify-center text-white">
                  <span>{post.username?.charAt(0).toUpperCase() || 'U'}</span>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-medium">{post.username}</span>
                      <span className="text-gray-500 text-sm ml-2">推荐了</span>
                      <span className="font-medium text-blue-500">{post.book_title ? `《${post.book_title}》` : '一本书'}</span>
                    </div>
                    <span className="text-gray-400 text-xs">{formatTimeAgo(post.created_at)}</span>
                  </div>
                  <p className="mt-2 text-gray-700">{post.content}</p>
                  <div className="mt-3 flex items-center text-gray-500 text-sm">
                    <button className="flex items-center mr-4 hover:text-blue-500">
                      <i className="far fa-thumbs-up mr-1"></i>
                      <span>{post.likes_count}</span>
                    </button>
                    <button className="flex items-center hover:text-blue-500">
                      <i className="far fa-comment mr-1"></i>
                      <span>{post.comments_count}条评论</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

// 格式化时间
function formatTimeAgo(dateString: string | Date) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds}秒前`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}小时前`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}天前`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}个月前`;
  }
  
  return `${Math.floor(diffInMonths / 12)}年前`;
}
