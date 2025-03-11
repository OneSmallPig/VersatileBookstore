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
    <nav className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center">
              <Image src="/images/logo.svg" alt="百变书屋" width={40} height={40} priority />
              <span className="ml-2 text-lg font-bold text-gray-900">百变书屋</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`nav-item text-base font-medium transition-colors ${
                isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              首页
            </Link>
            <Link 
              href="/search" 
              className={`nav-item text-base font-medium transition-colors ${
                isActive('/search') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              智能搜索
            </Link>
            <Link 
              href="/bookshelf" 
              className={`nav-item text-base font-medium transition-colors ${
                isActive('/bookshelf') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              我的书架
            </Link>
            <Link 
              href="/community" 
              className={`nav-item text-base font-medium transition-colors ${
                isActive('/community') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              社区
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link 
              href="/search" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <i className="fas fa-search text-xl"></i>
            </Link>
            <Link 
              href="/profile" 
              className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
            >
              <i className="fas fa-user"></i>
            </Link>
            <button 
              className="md:hidden text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* 移动端菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute inset-x-4 top-full mt-2">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-2">
              <Link 
                href="/" 
                className={`block px-4 py-2 rounded-md text-base font-medium ${
                  isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                首页
              </Link>
              <Link 
                href="/search" 
                className={`block px-4 py-2 rounded-md text-base font-medium ${
                  isActive('/search') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                智能搜索
              </Link>
              <Link 
                href="/bookshelf" 
                className={`block px-4 py-2 rounded-md text-base font-medium ${
                  isActive('/bookshelf') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                我的书架
              </Link>
              <Link 
                href="/community" 
                className={`block px-4 py-2 rounded-md text-base font-medium ${
                  isActive('/community') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                社区
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 