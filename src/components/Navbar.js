import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../imags/logo.jpg';
import profilePhoto from '../imags/profilePhoto.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import NavSearch from './NavSearch';

export default function Navbar() {
  const { username, email, profileImage } = useSelector((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const containsArabic = /[\u0600-\u06FF]/.test(username);
  let profilePath;

  if (containsArabic) {
    profilePath = `/profiles/${username.split(' ').join('-')}`;
  } else {
    profilePath = `/profiles/${username.toLowerCase().split(' ').join('-')}`;
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.querySelector('.list').classList.toggle('max-lg:hidden');
  };

  return (
    <nav className="py-1 px-4 sm:px-6 shadow fixed w-full bg-white z-40 border-t-4 border-orange-800">
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <Link to="/">
            <img
              src={logo}
              alt="logo"
              className="h-12 min-w-12 lg:min-w-14 lg:h-14"
            />
          </Link>
          <div className="relative">
            <NavSearch />
          </div>
        </div>
        <div className="list max-lg:hidden text-[15px] max-lg:absolute top-12 -left-5 z-50 max-lg:py-3 max-lg:px-5 max-lg:gap-3 max-lg:bg-white max-lg:w-[calc(100%+30px)] flex max-lg:flex-col-reverse lg:gap-9">
          <ul className="flex lg:gap-5 items-center  max-lg:flex-col max-lg:items-start max-lg:gap-2 max-lg:border-t max-lg:pt-3">
            <li className="text-slate-500 hover:text-black transition-all">
              <Link to="/">الرئيسية</Link>
            </li>
            <li className="text-slate-500 hover:text-black transition-all">
              <Link to="/about">من نحن</Link>
            </li>
            <li className="text-slate-500 hover:text-black transition-all">
              <Link to="/contact">تواصل معنا</Link>
            </li>
            <li className="text-slate-500 hover:text-black transition-all lg:hidden">
              <Link to="/publishBook">إنشر معنا</Link>
            </li>
          </ul>
          <div className="lg:gap-5">
            {!username && (
              <div className="flex max-lg:flex-col max-lg:gap-2 gap-4">
                <Link
                  to="/login"
                  className="transition-all hover:text-orange-800 font-semibold"
                >
                  دخول
                </Link>
                <Link
                  to="/register"
                  className="transition-all hover:text-orange-800  font-semibold"
                >
                  حساب جديد
                </Link>
              </div>
            )}
            {username && (
              <div className="flex items-start lg:items-center max-lg:flex-col-reverse gap-4 max-lg:gap-3">
                <Link
                  to="/logout"
                  className="transition-all hover:text-orange-800  font-semibold"
                >
                  تسجيل خروج
                </Link>
                <Link
                  to={profilePath}
                >
                  <div className="flex gap-3 items-center" title='الصفحة الشخصية'>
                    <img
                      src={
                        profileImage
                          ? `http://localhost:1337${profileImage}`
                          : profilePhoto
                      }
                      alt="profile"
                      className="w-9 rounded-full cursor-pointer"
                    />
                    <div className="text-sm lg:hidden font-medium">
                      <p>{username}</p>
                      <p className="text-slate-500">{email}</p>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
        <FontAwesomeIcon
          icon={menuOpen ? faXmark : faBars}
          onClick={toggleMenu}
          className="lg:hidden text-xl text-[#a1a1aa] transition-all hover:bg-[#f4f4f5] p-1 rounded-lg cursor-pointer mr-3"
        />
      </div>
    </nav>
  );
}
