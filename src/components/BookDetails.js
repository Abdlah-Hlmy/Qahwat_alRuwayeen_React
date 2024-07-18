import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import {
  faHeart,
  faBookmark,
  faPenToSquare,
} from '@fortawesome/free-regular-svg-icons';
import {
  faHeart as faHeartSolid,
  faBookmark as faBookmarkSolid,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navbar from './Navbar';
import ReadMore from './handleDescription';
import profilePhoto from '../imags/profilePhoto.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavorite, deleteFromFavorite } from '../rtk/slices/favoriteSlice';
import { addToLibrary, deleteFromLibrary } from '../rtk/slices/librarySlice';
import RatePopup from './RatePopup';
import BookRate from './BookRate';
import { toast, ToastContainer } from 'react-toastify';
import Footer from './Footer';

const BookDetails = ({ books }) => {
  const userId = useSelector((state) => state.user.id);
  const authorInfo = useSelector((state) => state.user.authorInfo);
  const favoriteBooks = useSelector(
    (state) => state.favoriteBooks[userId] || []
  );
  const libraryBooks = useSelector((state) => state.libraryBooks[userId] || []);
  const dispatch = useDispatch();
  const { bookTitle } = useParams();
  const [book, setBook] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      const bookFromRedux = books.find(
        (book) => book.attributes.bookTitle.split(' ').join('-') === bookTitle
      );
      if (bookFromRedux) {
        setBook(bookFromRedux);
        setIsLoading(false);
      } else {
        try {
          const response = await axios.get(
            `http://localhost:1337/api/books?filters[bookTitle][$eq]=${bookTitle.split('-').join(' ')}&filters[published][$eq]=true`
          );
          if (response.data.data.length > 0) {
            setBook(response.data.data[0]);
          }
        } catch (error) {
          console.error('Error fetching book:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchBook();
  }, [bookTitle, books]);

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

  const handleRatePopup = () => {
    if (!userId) {
      toast.error('يرجى تسجيل الدخول لإضافة تقييم', {
        autoClose: 3000,
      });
    } else {
      setShowPopup(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-100">
        <FontAwesomeIcon
          className="text-4xl text-slate-700"
          icon={faSpinner}
          spin
        />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-100">
        <p className="text-2xl text-slate-700">الكتاب غير موجود</p>
      </div>
    );
  }

  const isInLibrary = libraryBooks.some((lib) => lib && lib.id === book.id);
  const isInFavorite = favoriteBooks.some((fav) => fav && fav.id === book.id);

  return (
    <>
      <div className="min-h-[100vh] bg-slate-100 pb-5 ">
        <Navbar />
        <ToastContainer className="toast-container" />
        <div className="px-5 pt-[85px]">
          <div className="pr-1 text-[15px] flex gap-1">
            <Link
              to="/"
              className="text-orange-800 transition-all hover:text-orange-900 font-semibold"
            >
              الرئيسية
            </Link>{' '}
            /{' '}
            <span className="text-slate-500 transition-all hover:text-black cursor-pointer">
              الكتب
            </span>{' '}
            /{' '}
            <span className="text-slate-500 transition-all hover:text-black cursor-pointer">
              {book.attributes.bookTitle}
            </span>
          </div>
          <div className="bg-white w-full mt-5 mb-4 rounded-md p-3">
            <div className="flex max-md:flex-col gap-7">
              <div>
                <div className="w-[220px] h-[330px] max-md:mx-auto overflow-hidden rounded-lg ">
                  <img
                    src={`http://localhost:1337${book.attributes.bookCover.data.attributes.url}`}
                    alt="book cover"
                    className="w-[220px] h-full rounded-lg hover:scale-105 hover:opacity-95 transition-all duration-[1.2s]"
                  />
                </div>
              </div>
              <div className="w-full md:w-5/6">
                <div className="flex justify-between">
                  <h1 className="text-lg font-bold text-[#333]">
                    {book.attributes.bookTitle}
                  </h1>
                  <button
                    onClick={() => handleFavoriteAction(book)}
                    title={
                      isInFavorite
                        ? 'حذف الكتاب من المفضلة'
                        : 'إضافة الكتاب إلى المفضلة'
                    }
                  >
                    <FontAwesomeIcon
                      icon={isInFavorite ? faHeartSolid : faHeart}
                      className="transition-all text-red-500 text-lg cursor-pointer hover:text-red-600"
                    />
                  </button>
                </div>
                <div className="mt-3">
                  <div className="text-sm mb-1">
                    تأليف :{' '}
                    <Link
                      to={`/authors/${book.attributes.authorName
                        .split(' ')
                        .join('-')}`}
                      className="text-red-500 font-semibold relative before:absolute before:w-full before:h-[1px]
                      before:bg-red-500 before:bottom-[2px] before:invisible hover:before:visible"
                    >
                      {book.attributes.authorName}
                    </Link>
                  </div>
                  <div className="text-sm mb-1">
                    التصنيف :{' '}
                    <div
                      className="text-red-500 inline-block font-semibold relative before:absolute before:w-full before:h-[1px]
                      before:bg-red-500 before:bottom-[2px] before:invisible hover:before:visible"
                    >
                      {book.attributes.Classification}
                    </div>
                  </div>
                  <div className="text-sm">
                    التقييمات :{' '}
                    <div
                      className="text-red-500 inline-block font-semibold relative before:absolute before:w-full before:h-[1px]
                      before:bg-red-500 before:bottom-[2px] before:invisible hover:before:visible"
                    >
                      {book.attributes.ratings
                        ? book.attributes.ratings.length
                        : 0}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center max-md:justify-center max-md:flex-col gap-x-3 gap-y-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleLibraryAction(book)}
                      title={
                        isInLibrary
                          ? 'حذف الكتاب من المكتبة'
                          : 'إضافة الكتاب إلى المكتبة'
                      }
                      className="bg-[#222] transition-all hover:bg-black text-white flex justify-center items-center gap-2 w-[90px] py-1 rounded-md"
                    >
                      حفظ
                      <FontAwesomeIcon
                        icon={isInLibrary ? faBookmarkSolid : faBookmark}
                      />
                    </button>
                    <button
                      onClick={() => handleRatePopup()}
                      title="تقييم الكتاب"
                      className="bg-red-500 transition-all hover:bg-red-600 text-white flex justify-center items-center gap-2 w-[90px] py-1 rounded-md"
                    >
                      تقييم
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                  </div>
                  <div className="flex items-start text-xs gap-1 mr-2">
                    تقييم الكتاب
                    <BookRate bookId={book.id} />
                  </div>
                </div>
                <div>
                  <div className="mt-8 font-semibold text-[#333] border-b-[3px] border-red-500 w-fit pb-[3px] -tracking-tight">
                    نبذة عن الكتاب
                  </div>
                  <p className="text-slate-700 mt-3">
                    <ReadMore
                      text={book.attributes.description}
                      maxLength={400}
                    />
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 mt-6 mb-2">
                  <a
                    href={`http://localhost:1337${book.attributes.Link.data.attributes.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`قراءة ${book.attributes.bookTitle}`}
                    className="bg-black text-white flex justify-center items-center gap-2 px-3 py-1 rounded-md"
                  >
                    الإنتقال إلي الكتاب
                    <FontAwesomeIcon icon="fa-solid fa-cloud-arrow-up" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          {showPopup && (
            <RatePopup onClose={() => setShowPopup(false)} bookId={book.id} />
          )}
          {authorInfo && (
            <div className="bg-white w-full rounded-md py-3 px-4">
              <Link
                to={`/authors/${book.attributes.authorName.split(' ').join('-')}`}
                className="flex gap-2 items-center w-fit"
              >
                <img
                  src={profilePhoto}
                  alt="author photo"
                  className="w-[40px] rounded-full"
                />
                <h1 className="text-base font-semibold text-[#333]">
                  {book.attributes.authorName}
                </h1>
              </Link>
              <p className="text-slate-700 mt-1 pb-2">
                <ReadMore text={authorInfo} maxLength={400} />
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookDetails;
