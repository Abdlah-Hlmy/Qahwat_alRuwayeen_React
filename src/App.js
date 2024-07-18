import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowUp, fas, faSpinner } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(fas);

const Home = lazy(() => import('./Pages/Home'));
const Login = lazy(() => import('./Pages/Login'));
const Registration = lazy(() => import('./Pages/Registration'));
const AboutUs = lazy(() => import('./Pages/AboutUs'));
const Contact = lazy(() => import('./Pages/Contact'));
const Logout = lazy(() => import('./components/Logout'));
const ProfilePage = lazy(() => import('./Pages/ProfilePage'));
const BookDetails = lazy(() => import('./components/BookDetails'));
const PublishBook = lazy(() => import('./Pages/PublishBook'));
const AuthorProfile = lazy(() => import('./Pages/AuthorProfile'));
const EditBook = lazy(() => import('./components/EditBook'));
const SearchResults = lazy(() => import('./Pages/SearchResults'));

function App() {
  const books = useSelector((state) => state.books);

  const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };

    useEffect(() => {
      window.addEventListener('scroll', toggleVisibility);
      return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
      <button
        className={`fixed bottom-4 right-4 z-40 transition-all bg-brown-500 hover:bg-brown-700 text-white w-9 h-9 rounded-full flex-center ${isVisible ? 'visible' : 'invisible'
          }`}
        onClick={scrollToTop}
      >
        <FontAwesomeIcon icon={faArrowUp} />
      </button>
    );
  };

  return (
    <div className="App">
      <ScrollToTopButton />
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen bg-slate-100">
            <FontAwesomeIcon className="text-4xl text-slate-800" icon={faSpinner} spin />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/profiles/:userName" element={<ProfilePage />} />
          <Route
            path="books/:bookTitle"
            element={<BookDetails books={books} />}
          />
          <Route path="/publishBook" element={<PublishBook />} />
          <Route
            path="/authors/:authorName"
            element={<AuthorProfile books={books} />}
          />
          <Route path="/edit-book/:bookTitle" element={<EditBook />} />
          <Route path="/search/:value" element={<SearchResults />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
