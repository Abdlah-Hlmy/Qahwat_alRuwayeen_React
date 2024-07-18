import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getBooks } from '../rtk/slices/booksSlice';
import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import MainSearch from '../components/MainSearch';
import { toast, ToastContainer } from 'react-toastify';
import SelectBooks from '../components/SelectBooks';
import Footer from '../components/Footer';

export default function Home() {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books);
  const userId = useSelector((state) => state.user.id);
  const [sortOrder, setSortOrder] = useState('');
  const [visibleBooks, setVisibleBooks] = useState(24);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    dispatch(getBooks()).then(() => setLoading(false));
  }, [dispatch]);

  const sortedBooks = [...books].reverse();

  if (sortOrder === 'LastFirst') {
    sortedBooks.sort((a, b) => a.id - b.id);
  } else if (sortOrder === 'FirstLast') {
    sortedBooks.sort((a, b) => b.id - a.id);
  }

  const handleLoadMore = () => {
    setVisibleBooks((prevVisibleBooks) => prevVisibleBooks + 24);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-100">
        <FontAwesomeIcon
          className="text-4xl text-slate-800"
          icon={faSpinner}
          spin
        />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="w-full h-screen bg-custom-image bg-fixed flex justify-center relative before:absolute before:bg-black before:opacity-30 before:w-full before:h-full">
        <ToastContainer className="toast-container" />
        <div className="z-10 text-center my-auto">
          <div className="text-white text-6xl font-semibold">
            قهوة الروائيين
          </div>
          <p className="text-white mt-3 mb-8 tracking-widest">
            مكان يلتقي فيه القارئ والكاتب
          </p>
          <MainSearch />
        </div>
      </div>
      <div className="bg-slate-100 py-8 px-5">
        <div className={`mb-8 ${books.length > 0 && 'flex justify-between md:w-[54%] items-center max-md:flex-row-reverse'}`}>
          {books.length > 0 && <SelectBooks setSortOrder={setSortOrder} />}
          <div className={`bg-black text-white w-28 text-center py-[10px] rounded-full font-semibold ${books.length === 0 && 'mx-auto'}`}>
            {!userId ? (
              <button
                onClick={() => {
                  toast.error('يرجي تسجيل الدخول لكي تتمكن من نشر كتابك', {
                    autoClose: 3000,
                  });
                }}
              >
                إنشر كتابك
              </button>
            ) : (
              <Link to="/publishBook">إنشر كتابك</Link>
            )}
          </div>
        </div>
        {books.length === 0 && (
          <div className="bg-white p-3 mt-4 font-semibold">
            لا توجد كتب مضافة حتى الآن.
          </div>
        )}
        <div className="grid grid-cols-auto max-sm:grid-cols-2 gap-x-3 gap-y-5">
          <BookCard books={sortedBooks.slice(0, visibleBooks)} height={300} />
        </div>
        {visibleBooks < sortedBooks.length && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleLoadMore}
              className="border border-red-500 hover:bg-transparent hover:text-red-500 py-1 px-3 rounded-md transition-all bg-red-500 text-white duration-300"
            >
              عرض المزيد
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
