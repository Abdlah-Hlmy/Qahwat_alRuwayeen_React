import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import BookCard from '../components/BookCard';
import profilePhoto from '../imags/profilePhoto.jpg';
import Footer from '../components/Footer';

const AuthorProfile = () => {
  const { authorName } = useParams();
  const [books, setBooks] = useState([]);
  const [visibleBooks, setVisibleBooks] = useState(12);
  const [authorInfo, setAuthorInfo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`http://localhost:1337/api/books?filters[authorName][$eq]=${authorName.split('-').join(' ')}`);
        setBooks(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching books:', error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, [authorName]);

  useEffect(() => {
    const findAuthorInfo = () => {
      for (let book of books) {
        if (book.attributes.authorName.split(' ').join('-') === authorName) {
          if (
            book.attributes.authorInfo &&
            book.attributes.authorInfo.trim() !== ''
          ) {
            setAuthorInfo(book.attributes.authorInfo);
            break;
          }
        }
      }
    };
    findAuthorInfo();
  }, [books, authorName]);

  const handleLoadMore = () => {
    setVisibleBooks((prevVisibleBooks) => prevVisibleBooks + 12);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-100">
        <FontAwesomeIcon className="text-4xl text-slate-800" icon={faSpinner} spin />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-[100vh] bg-slate-100 pb-5">
        <Navbar />
        <div className="px-3 pt-[85px]">
          {books.length === 0 ? (
            <div className="bg-white p-3 mt-4 font-semibold rounded-sm">
              لم يتم العثور على أعمال لهذا الكاتب.
            </div>
          ) : (
            <>
              <div className="pr-1 text-[15px] mb-5 border-b pb-4 border-slate-200">
                <Link
                  to="/"
                  className="text-orange-800 transition-all hover:text-orange-900 font-semibold"
                >
                  الرئيسية
                </Link>{' '}
                /{' '}
                <span className="text-slate-500 transition-all hover:text-black cursor-pointer">
                  المؤلفون
                </span>{' '}
                /{' '}
                <span className="text-slate-500 transition-all hover:text-black cursor-pointer">
                  {authorName.split('-').join(' ')}
                </span>
              </div>
              {authorInfo && (
                <div className="bg-white w-full rounded-md py-3 mb-5 px-4 shadow">
                  <div className="flex gap-2 items-center w-fit">
                    <img
                      src={profilePhoto}
                      alt="author photo"
                      className="w-[40px] rounded-full"
                    />
                    <h1 className="text-base font-semibold text-[#333]">
                      {authorName.split('-').join(' ')}
                    </h1>
                  </div>
                  <p className="text-slate-700 mt-1 pb-2">{authorInfo}</p>
                </div>
              )}
              <div className="flex gap-1 mt-2 mb-5 pb-1 mr-1 border-b-[3px] border-red-500 w-fit text-xl font-semibold text-slate-700">
                <div>الكتب المتاحة للكاتب</div>
                <span className="text-[13px]">({books.length})</span>
              </div>
              <div className="grid grid-cols-auto max-sm:grid-cols-2 gap-x-3 gap-y-5">
                <BookCard books={books.slice(0, visibleBooks)} height={300} />
              </div>
              {visibleBooks < books.length && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleLoadMore}
                    className="border border-red-500 hover:bg-transparent hover:text-red-500 py-1 px-3 rounded-md transition-all bg-red-500 text-white duration-300"
                  >
                    عرض المزيد
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AuthorProfile;
