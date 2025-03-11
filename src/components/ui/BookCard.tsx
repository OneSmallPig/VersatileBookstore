import Link from 'next/link';
import Image from 'next/image';
import { Book } from '@/lib/models/book';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const {
    id,
    title,
    author,
    cover_image,
    rating,
    tags = [],
    description,
    isRecommended,
    isNew
  } = book;

  // 处理评分星级显示
  const renderRatingStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<i key={i} className="fas fa-star text-yellow-400"></i>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<i key={i} className="fas fa-star-half-alt text-yellow-400"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star text-yellow-400"></i>);
      }
    }

    return stars;
  };

  // 处理添加到书架
  const handleAddToBookshelf = async () => {
    try {
      const response = await fetch('/api/bookshelf/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId: id }),
      });

      if (response.ok) {
        alert('已添加到书架');
      } else {
        const data = await response.json();
        alert(data.message || '添加失败，请重试');
      }
    } catch (error) {
      console.error('添加书架失败:', error);
      alert('添加失败，请重试');
    }
  };

  return (
    <div className="book-card bg-white p-4 rounded-lg shadow-sm h-full flex flex-col" data-id={id}>
      <div className="book-cover-container relative w-[120px] h-[180px] mx-auto mb-4 transition-transform duration-200 group-hover:transform group-hover:scale-105">
        <Image
          src={cover_image || `/images/book-covers/default-book.svg`}
          alt={title}
          width={120}
          height={180}
          className="book-cover w-full h-full object-cover rounded-md shadow-md"
        />
        {isNew && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">新书</div>
        )}
        {isRecommended && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">推荐</div>
        )}
      </div>

      <div className="book-card-content flex-1 flex flex-col">
        <div className="book-meta text-center mb-2">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <p className="text-gray-600 text-sm">{author}</p>

          <div className="rating mt-1 text-sm">
            {renderRatingStars()}
            <span className="text-gray-600 ml-1">{rating}</span>
          </div>

          <div className="mt-2 flex flex-wrap gap-1 justify-center">
            {tags.map((tag, index) => (
              <span key={index} className="tag bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {description && (
          <p className="book-intro text-sm text-gray-600 line-clamp-3 mb-3">
            {description}
          </p>
        )}

        <div className="book-actions mt-auto flex justify-between">
          <Link
            href={`/book/${id}`}
            className="btn-primary bg-blue-500 text-white text-sm py-1 px-3 rounded hover:bg-blue-600 transition-all"
          >
            详情
          </Link>
          <button
            className="btn-secondary bg-gray-100 text-gray-600 text-sm py-1 px-3 rounded hover:bg-gray-200 transition-all"
            onClick={handleAddToBookshelf}
          >
            加入书架
          </button>
        </div>
      </div>
    </div>
  );
} 