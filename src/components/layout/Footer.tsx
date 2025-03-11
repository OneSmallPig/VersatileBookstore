import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">百变书屋</h3>
            <p className="text-gray-400">您的私人智能图书馆，为您提供个性化的阅读体验。</p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">功能</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-white">首页</Link></li>
              <li><Link href="/search" className="hover:text-white">智能搜索</Link></li>
              <li><Link href="/bookshelf" className="hover:text-white">我的书架</Link></li>
              <li><Link href="/community" className="hover:text-white">社区</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">关于我们</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white">关于百变书屋</Link></li>
              <li><Link href="/contact" className="hover:text-white">联系我们</Link></li>
              <li><Link href="/privacy" className="hover:text-white">隐私政策</Link></li>
              <li><Link href="/terms" className="hover:text-white">使用条款</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">关注我们</h3>
            <div className="flex space-x-4 text-gray-400">
              <a href="#" className="hover:text-white text-xl"><i className="fab fa-weixin"></i></a>
              <a href="#" className="hover:text-white text-xl"><i className="fab fa-weibo"></i></a>
              <a href="#" className="hover:text-white text-xl"><i className="fab fa-qq"></i></a>
              <a href="#" className="hover:text-white text-xl"><i className="fab fa-github"></i></a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} 百变书屋 - 私人智能图书馆. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
} 