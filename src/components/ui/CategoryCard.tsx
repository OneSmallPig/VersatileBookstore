import Link from 'next/link';
import { Category } from '@/lib/models/category';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const { id, name, icon, color, book_count = 0 } = category;
  
  // 根据分类名称选择图标
  const getIconClass = () => {
    if (icon) return `fas fa-${icon}`;
    
    switch (name) {
      case '计算机科学':
        return 'fas fa-laptop-code';
      case '科学':
        return 'fas fa-flask';
      case '心理学':
        return 'fas fa-brain';
      case '历史':
        return 'fas fa-landmark';
      case '文学':
        return 'fas fa-book-open';
      case '经济学':
        return 'fas fa-chart-line';
      default:
        return 'fas fa-book';
    }
  };
  
  // 根据分类名称选择背景色
  const getBgColor = () => {
    if (color) return `bg-${color}-500 hover:bg-${color}-600`;
    
    switch (name) {
      case '计算机科学':
        return 'bg-blue-500 hover:bg-blue-600';
      case '科学':
        return 'bg-green-500 hover:bg-green-600';
      case '心理学':
        return 'bg-purple-500 hover:bg-purple-600';
      case '历史':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case '文学':
        return 'bg-red-500 hover:bg-red-600';
      case '经济学':
        return 'bg-indigo-500 hover:bg-indigo-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };
  
  return (
    <Link 
      href={`/search?category=${encodeURIComponent(name)}`}
      className={`${getBgColor()} text-white rounded-lg p-4 text-center transition-colors`}
    >
      <i className={`${getIconClass()} text-2xl mb-2`}></i>
      <div>{name}</div>
      <div className="text-xs mt-1 text-white/80">{book_count} 本书</div>
    </Link>
  );
} 