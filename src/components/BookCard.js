import { faBookmark, faHeart } from '@fortawesome/free-solid-svg-icons';
import {
  faHeart as faHeartRegular,
  faBookmark as faBookmarkRegular,
} from '@fortawesome/free-regular-svg-icons';
import React from 'react';
import { Link } from 'react-router-dom';
import { deleteFromLibrary, addToLibrary } from '../rtk/slices/librarySlice';
import { addToFavorite, deleteFromFavorite } from '../rtk/slices/favoriteSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import BookRate from './BookRate';
import { toast, ToastContainer } from 'react-toastify';

export default function BookCard({ books, height }) {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user?.id);
  const favoriteBooks = useSelector(
    (state) => state.favoriteBooks[userId] || []
  );
  const libraryBooks = useSelector((state) => state.libraryBooks[userId] || []);

  const handleLibraryAction = (book) => {
    if (!userId) {
      toast.error('يرجى تسجيل الدخول لإضافة الكتاب إلى المكتبة', {
        autoClose: 3000,
      });
    } else {
      const isInLibrary = libraryBooks.some((lib) => lib && lib.id === book.id);
      if (isInLibrary) {
        dispatch(deleteFromLibrary({ userId, bookId: book.id }));
      } else {
        dispatch(addToLibrary({ userId, book }));
      }
    }
  };

  const handleFavoriteAction = (book) => {
    if (!userId) {
      toast.error('يرجى تسجيل الدخول لإضافة الكتاب إلى المفضلة', {
        autoClose: 3000,
      });
    } else {
      const isInFavorite = favoriteBooks.some(
        (fav) => fav && fav.id === book.id
      );
      if (isInFavorite) {
        dispatch(deleteFromFavorite({ userId, bookId: book.id }));
      } else {
        dispatch(addToFavorite({ userId, book }));
      }
    }
  };

  return books.map((book) => {
    if (
      !book ||
      !book.id ||
      !book.attributes ||
      !book.attributes.bookTitle ||
      !book.attributes.bookCover ||
      !book.attributes.bookCover.data ||
      !book.attributes.bookCover.data.attributes ||
      !book.attributes.bookCover.data.attributes.url ||
      !book.attributes.authorName ||
      !book.attributes.published
    ) {
      return null;
    }
  
    const isInLibrary = libraryBooks.some((lib) => lib && lib.id === book.id);
    const isInFavorite = favoriteBooks.some((fav) => fav && fav.id === book.id);
    
    return (
      <div
        key={book.id}
        className="overflow-hidden bg-white pb-3 rounded-t-xl border border-[#ddd] transition-all duration-300 shadow-sm hover:shadow-md"
      >
        <ToastContainer className="toast-container" />
        <div className="overflow-hidden">
          <Link to={`/books/${book.attributes.bookTitle.split(' ').join('-')}`}>
            <img
              title={book.attributes.bookTitle}
              className={`w-full rounded-t-xl h-[${height}px] max-sm:h-[280px] hover:scale-105 hover:opacity-95 transition-all duration-[1.2s]`}
              src={`http://localhost:1337${book.attributes.bookCover.data.attributes.url}`}
              alt={book.attributes.bookTitle}
            />
          </Link>
        </div>
        <div className="px-3 pt-[14px] pb-2 text-center">
          <h1 className="font-semibold text-[15px]">
            {book.attributes.bookTitle}
          </h1>
          <Link
            to={`/authors/${book.attributes.authorName.split(' ').join('-')}`}
            className="text-slate-500 pt-[6px] text-sm cursor-pointer"
          >
            {book.attributes.authorName}
          </Link>
        </div>
        <div className="flex justify-center items-center px-2 gap-2 mb-[6px]">
          <BookRate bookId={book.id} />
          <div className="flex gap-2 text-[#333]">
            <button
              onClick={() => handleLibraryAction(book)}
              title={
                isInLibrary
                  ? 'حذف الكتاب من المكتبة'
                  : 'إضافة الكتاب إلى المكتبة'
              }
            >
              <FontAwesomeIcon
                className='cursor-pointer transition-all hover:text-black'
                icon={isInLibrary ? faBookmark : faBookmarkRegular}
              />
            </button>
            <button
              onClick={() => handleFavoriteAction(book)}
              title={
                isInFavorite
                  ? 'حذف الكتاب من المفضلة'
                  : 'إضافة الكتاب إلى المفضلة'
              }
            >
              <FontAwesomeIcon
                className={`cursor-pointer transition-all hover:text-red-500 ${isInFavorite && 'text-red-500 hover:text-red-600'
                  }`}
                icon={isInFavorite ? faHeart : faHeartRegular}
              />
            </button>
          </div>
        </div>
      </div>
    );
  });
}
