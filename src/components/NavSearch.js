import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import profilePhoto from '../imags/profilePhoto.jpg';

export default function NavSearch() {
  const [value, setValue] = useState('');
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const navigate = useNavigate();

  const fetchBooks = (value) => {
    setLoading(true);
    setSearchCompleted(false);
    axios
      .get(
        'http://localhost:1337/api/books?filters[published][$eq]=true'
      )
      .then((res) => {
        const result = res.data.data.filter((book) => {
          return value && book && book.attributes.bookTitle.includes(value);
        });
        setBooks(result);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
        setSearchCompleted(true);
      });
  };

  const fetchAuthors = (value) => {
    setLoading(true);
    setSearchCompleted(false);
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
        setLoading(false);
        setSearchCompleted(true);
      });
  };
  

  const handleChange = (value) => {
    setValue(value);
    if (value) {
      fetchBooks(value);
      fetchAuthors(value);
    } else {
      setBooks([]);
      setAuthors([]);
      setSearchCompleted(false);
    }
  };
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate(`/search/${value.split(' ').join('-')}`);
        }}
        className="h-fit flex items-center justify-start relative max-md:w-[calc(100vw-140px)]">
        <input
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          type="text"
          placeholder="عنوان الكتاب, المؤلف"
          className="border rounded-r-lg w-full md:w-64 px-3 border-l-0 focus:border-orange-800 text-sm h-8 transition-all"
        />
        <FontAwesomeIcon
          onClick={() => {
            setValue('');
            setBooks([]);
            setAuthors([]);
            setSearchCompleted(false);
          }}
          icon={faXmark}
          className={`absolute top-1/2 -translate-y-1/2 left-[57px] text-[13px] text-gray-800 ${value ? 'visible' : 'invisible'}`}
        />
        <Link to={`/search/${value.split(' ').join('-')}`}>
          <div className="bg-orange-800 hover:bg-orange-900 transition-all text-white h-8 w-12 flex justify-center items-center rounded-l-lg">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-sm"
            />
          </div>
        </Link>
      </form>
      <div className="w-[105%] bg-white rounded-lg flex flex-col text-start absolute top-8 -left-2 max-h-screen overflow-y-auto">
        {loading && (
          <div className="flex items-center gap-2 p-3 text-[14px]">
            جارِ التحميل
            <FontAwesomeIcon icon={faSpinner} spin />
          </div>
        )}
        {searchCompleted && !loading && books.length === 0 && authors.length === 0 && (
          <div className="text-pink-600 bg-[#fbd2d3] text-[14px] p-3">
            لا توجد نتائج بحث مطابقة.
          </div>
        )}
        {books.map((book) => (
          <div
            key={book.id}
            className="rounded-md mx-[6px] p-[6px] transition-all px-2 hover:bg-[#e2e8f0] first:mt-[6px] last:mb-[6px] group"
          >
            <Link
              to={`/books/${book.attributes.bookTitle.split(' ').join('-')}`}
              className="flex items-center gap-2 w-fit"
            >
              <img
                src={`http://localhost:1337${book.attributes.bookCover.data.attributes.url}`}
                className="w-7 h-7 rounded-full"
                alt={book.attributes.bookTitle}
              ></img>
              <div className="font-semibold text-sm group-hover:font-bold transition-all w-fit">
                {book.attributes.bookTitle}
              </div>
            </Link>
          </div>
        ))}
        {authors.map((author) => (
          <div
            key={author.id}
            className="rounded-md mx-[6px] p-[6px] transition-all px-2 hover:bg-[#e2e8f0] first:mt-[6px] last:mb-[6px] group"
          >
            <Link
              to={`/authors/${author.attributes.authorName
                .split(' ')
                .join('-')}`}
              className="flex items-center gap-1 w-fit"
            >
              <div className="flex items-center gap-2">
                <img
                  src={profilePhoto}
                  className="w-8 h-8 rounded-full"
                  alt={author.attributes.authorName}
                ></img>
                <div className="font-semibold text-sm group-hover:font-bold transition-all ">
                  {author.attributes.authorName}
                </div>
              </div>
              <div className="text-[13px] italic text-teal-500 group-hover:font-bold transition-all font-semibold">
                (مؤلف)
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
