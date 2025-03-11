'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  return (
    <nav className="sticky top-0 z-10 px-4 py-3 bg-white shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center">
              <Image src="/images/logo.svg" alt="百变书屋" width={40} height={40} />
              <span className="ml-2 text-lg font-bold">百变书屋</span>
            </div>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            href="/" 
            className={`nav-item font-medium ${isActive('/') ? 'text-blue-500 font-semibold' : 'text-gray-700 hover:text-blue-500'}`}
          >
            首页
          </Link>
          <Link 
            href="/search" 
            className={`nav-item font-medium ${isActive('/search') ? 'text-blue-500 font-semibold' : 'text-gray-700 hover:text-blue-500'}`}
          >
            智能搜索
          </Link>
          <Link 
            href="/bookshelf" 
            className={`nav-item font-medium ${isActive('/bookshelf') ? 'text-blue-500 font-semibold' : 'text-gray-700 hover:text-blue-500'}`}
          >
            我的书架
          </Link>
          <Link 
            href="/community" 
            className={`nav-item font-medium ${isActive('/community') ? 'text-blue-500 font-semibold' : 'text-gray-700 hover:text-blue-500'}`}
          >
            社区
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/search" className="text-gray-600 hover:text-blue-500">
            <i className="fas fa-search text-xl"></i>
          </Link>
          <Link href="/profile" className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <i className="fas fa-user"></i>
          </Link>
          <button 
            className="md:hidden text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>
      
      {/* 移动端菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 bg-white shadow-lg rounded-lg absolute right-4 left-4 p-4">
          <div className="flex flex-col space-y-3">
            <Link 
              href="/" 
              className={`py-2 px-4 rounded ${isActive('/') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-100'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              首页
            </Link>
            <Link 
              href="/search" 
              className={`py-2 px-4 rounded ${isActive('/search') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-100'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              智能搜索
            </Link>
            <Link 
              href="/bookshelf" 
              className={`py-2 px-4 rounded ${isActive('/bookshelf') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-100'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              我的书架
            </Link>
            <Link 
              href="/community" 
              className={`py-2 px-4 rounded ${isActive('/community') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-100'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              社区
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
} 