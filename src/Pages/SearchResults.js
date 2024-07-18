import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import profilePhoto from '../imags/profilePhoto.jpg';
import Navbar from '../components/Navbar';
import BookCard from '../components/BookCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/Footer';

export default function SearchResults() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingAuthors, setLoadingAuthors] = useState(true);
  const { value } = useParams();
  const vaildValue = value.split('-').join(' ');

  const fetchBooks = (value) => {
    axios
      .get(' http://localhost:1337/api/books?filters[published][$eq]=true')
      .then((res) => {
        const result = res.data.data.filter((book) => {
          return (
            value && book && book.attributes.bookTitle.includes(vaildValue)
          );
        });
        setBooks(result);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoadingBooks(false));
  };

  const fetchAuthors = (value) => {
    axios
      .get('http://localhost:1337/api/books?filters[published][$eq]=true')
      .then((res) => {
        const uniqueAuthors = new Set();
        const result = res.data.data.filter((author) => {
          const authorName = author?.attributes?.authorName;
          if (value && authorName && authorName.includes(value)) {
            if (!uniqueAuthors.has(authorName)) {
              uniqueAuthors.add(authorName);
              return true;
            }
          }
          return false;
        });
        setAuthors(result);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoadingAuthors(false);
      });
  };


  useEffect(() => {
    fetchBooks(vaildValue);
    fetchAuthors(vaildValue);
  }, []);

  const isLoading = loadingBooks || loadingAuthors;

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

  return (
    <>
      <div className="min-h-[100vh] bg-slate-100 pb-5">
        <Navbar />
        <div className="pt-[85px] px-3">
          <div className="flex items-center gap-1 mt-2 mb-4 pb-1 mr-1 border-b-[3px] border-red-500 w-fit text-xl font-semibold text-slate-700">
            <div>
              نتائج البحث عن{' '}
              <span className="text-red-500 text-2xl">"{vaildValue}"</span>{' '}
            </div>
            <span className="text-sm">({books.length + authors.length})</span>
          </div>
          {books.length === 0 && authors.length === 0 ? (
            <div className="bg-white p-3 rounded-md text-base font-semibold">
              لا توجد نتائج بحث مطابقة.
            </div>
          ) : null}
          {authors.length > 0 ? (
            <div
              className={`grid max-sm:grid-cols-2 sm:flex sm:flex-wrap gap-x-3 gap-y-5 mb-5 pb-5 ${books.length > 0 ? 'border-b' : null
                }`}
            >
              {authors.map((author) => (
                <div
                  title={`الإنتقاال إلي صفحة ${author.attributes.authorName}`}
                  key={author.id}
                  className="bg-white p-2 min-w-48 rounded-md transition-all hover:bg-slate-200 hover:-translate-x-1 border hover:border-white group"
                >
                  <Link
                    to={`/authors/${author.attributes.authorName
                      .split(' ')
                      .join('-')}`}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={profilePhoto}
                      alt={author.attributes.authorName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="font-semibold text-[15px] transition-all group-hover:font-bold">
                      {author.attributes.authorName}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : null}
          {books.length > 0 ? (
            <div className="grid grid-cols-auto max-sm:grid-cols-2 gap-x-3 gap-y-5">
              <BookCard books={books} height={300} />
            </div>
          ) : null}
        </div>
      </div>
      <Footer />
    </>
  );
}
