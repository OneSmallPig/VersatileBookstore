'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Book } from '@/lib/models/book';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { id, title, author, cover_image, rating = 0, category_name } = book;
  const router = useRouter();

  const handleAddToBookshelf = async () => {
    try {
      const response = await fetch('/api/bookshelf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId: id }),
      });

      if (!response.ok) {
        throw new Error('Failed to add book to bookshelf');
      }

      toast.success('成功添加到书架！');
    } catch (error) {
      toast.error('添加失败，请稍后重试');
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-yellow-400" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-yellow-400" />);
    }

    return stars;
  };

  return (
    <div className="book-card bg-white p-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <div className="book-cover-container relative w-[120px] h-[180px] mx-auto mb-4">
        <Image
          src={cover_image || '/images/book-placeholder.jpg'}
          alt={title}
          fill
          className="rounded-lg shadow-md object-cover transition-transform duration-200 group-hover:scale-105"
        />
      </div>
      
      <div className="book-card-content flex flex-col flex-grow">
        <div className="book-meta text-center mb-2">
          <h3 className="font-bold text-gray-900 text-lg mb-1">{title}</h3>
          <p className="text-gray-600 text-sm mb-2">{author}</p>
          <div className="rating flex items-center justify-center space-x-1 text-sm mb-2">
            {renderStars(rating)}
            <span className="text-gray-600 ml-2">{rating.toFixed(1)}</span>
          </div>
          {category_name && (
            <div className="mt-2 flex flex-wrap gap-1 justify-center">
              <span className="tag text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors">
                {category_name}
              </span>
            </div>
          )}
        </div>

        <div className="book-actions mt-auto flex justify-between space-x-2">
          <button
            onClick={() => router.push(`/books/${id}`)}
            className="flex-1 btn-primary bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            阅读
          </button>
          <button
            onClick={handleAddToBookshelf}
            className="flex-1 btn-secondary bg-gray-100 text-gray-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            加入书架
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard; 