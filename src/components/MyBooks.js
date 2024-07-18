import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faBookmark, faHeart } from '@fortawesome/free-solid-svg-icons';
import {
  faHeart as faHeartRegular,
  faBookmark as faBookmarkRegular,
} from '@fortawesome/free-regular-svg-icons';
import { deleteFromLibrary, addToLibrary } from '../rtk/slices/librarySlice';
import { addToFavorite, deleteFromFavorite } from '../rtk/slices/favoriteSlice';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DeletePopup from './DeletePopup';
import BookRate from './BookRate';

export default function MyBooks() {
  const userId = useSelector((state) => state.user?.id);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const favoriteBooks = useSelector(
    (state) => state.favoriteBooks[userId] || []
  );
  const libraryBooks = useSelector((state) => state.libraryBooks[userId] || []);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1337/api/books?filters[addedBy][id][$eq]=${userId}&filters[published][$eq]=true`
        );

        setBooks(response.data.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setBooks([]);
        } else {
          console.error('Error fetching books:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [userId]);

  const handleDelete = async (bookId) => {
    setSelectedBookId(bookId);
    setShowPopup(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:1337/api/books/${selectedBookId}`);
      setBooks(books.filter((book) => book.id !== selectedBookId));
      dispatch(deleteFromFavorite({ userId, bookId: selectedBookId }));
      dispatch(deleteFromLibrary({ userId, bookId: selectedBookId }));
      setShowPopup(false);
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const cancelDelete = () => {
    setShowPopup(false);
  };

  const handleLibraryAction = (book) => {
    const isInLibrary = libraryBooks.some((lib) => lib && lib.id === book.id);
    if (isInLibrary) {
      dispatch(deleteFromLibrary({ userId, bookId: book.id }));
    } else {
      dispatch(addToLibrary({ userId, book }));
    }
  };

  const handleFavoriteAction = (book) => {
    const isInFavorite = favoriteBooks.some((fav) => fav && fav.id === book.id);
    if (isInFavorite) {
      dispatch(deleteFromFavorite({ userId, bookId: book.id }));
    } else {
      dispatch(addToFavorite({ userId, book }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FontAwesomeIcon className="text-4xl" icon={faSpinner} spin />
      </div>
    );
  }

  return (
    <div>
      {books.length === 0 ? (
        <div>
          <span className="text-sm font-semibold block mb-4">
            أعمالي <span className="text-red-500">(0)</span>
          </span>
          <p className="bg-amber-100 p-2 mt-4">لا توجد أي أعمال بعد.</p>
        </div>
      ) : (
        <>
          <span className="text-sm font-semibold block mb-4">
            أعمالي <span className="text-red-500">({books.length})</span>
          </span>
          <div className="grid grid-cols-auto-small max-sm:grid-cols-2 gap-x-3 gap-y-5">
            {books.map((book) => {
              const isInLibrary = libraryBooks.some((lib) => lib && lib.id === book.id);
              const isInFavorite = favoriteBooks.some((fav) => fav && fav.id === book.id);
              return (
                <div
                  key={book.id}
                  className="overflow-hidden bg-white pb-3 rounded-t-xl border border-[#ddd] transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="overflow-hidden">
                    <Link
                      to={`/books/${book.attributes.bookTitle
                        .split(' ')
                        .join('-')}`}
                    >
                      <img
                        title={book.attributes.bookTitle}
                        className={`w-full rounded-t-xl h-[270px] max-md:h-[270px] hover:scale-105 hover:opacity-95 transition-all duration-[1.2s]`}
                        src={`http://localhost:1337${book.attributes.bookCover.data.attributes.url}`}
                        alt={book.attributes.bookTitle}
                      />
                    </Link>
                  </div>
                  <div className="p-3 pb-1 text-center">
                    <h1 className="font-semibold text-[15px]">
                      {book.attributes.bookTitle}
                    </h1>
                    <Link
                      to={`/authors/${book.attributes.authorName
                        .split(' ')
                        .join('-')}`}
                      className="text-slate-500 pt-[6px] text-sm cursor-pointer"
                    >
                      {book.attributes.authorName}
                    </Link>
                  </div>
                  <div className="flex justify-center items-center px-2 mb-[2px] gap-2">
                    <BookRate bookId={book.id} />
                    <div className="flex gap-2">
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
                  <div className="flex">
                    <div className="flex justify-center w-1/2">
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="w-full bg-red-500 transition-all hover:bg-red-600 text-white p-1 mt-1 -mb-3"
                        title="حذف الكتاب"
                      >
                        حذف
                      </button>
                    </div>
                    <div className="flex w-1/2 border-r border-white text-center">
                      <Link
                        to={`/edit-book/${book.attributes.bookTitle
                          .split(' ')
                          .join('-')}`}
                        className="w-full bg-red-500 transition-all hover:bg-red-600 text-white p-1 mt-1 -mb-3"
                        title="تعديل الكتاب"
                      >
                        تعديل
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {showPopup && (
        <DeletePopup
          title="هل أنت متأكد؟"
          message="سيتم حذف هذا الكتاب من قاعدة البيانات!"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}
