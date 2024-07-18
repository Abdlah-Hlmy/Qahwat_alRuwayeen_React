import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { updateUser } from '../rtk/slices/userSlice';
import axios from 'axios';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import profilePhoto from '../imags/profilePhoto.jpg';
import BookCard from '../components/BookCard';
import MyBooks from '../components/MyBooks';
import { clearFavorite } from '../rtk/slices/favoriteSlice';
import { clearLibrary } from '../rtk/slices/librarySlice';
import Footer from '../components/Footer';

export default function ProfilePage() {
  const { username, email, token, id, profileImage } = useSelector(
    (state) => state.user
  );

  const [newUsername, setNewUsername] = useState(username);
  const [newEmail, setNewEmail] = useState(email);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.id);
  const favoriteBooks = useSelector(
    (state) => state.favoriteBooks[userId] || []
  );
  const libraryBooks = useSelector((state) => state.libraryBooks[userId] || []);
  const books = useSelector((state) => state.books);
  const [activeTab, setActiveTab] = useState('myworks');

  const bookExists = (bookId) => books.some((book) => book.id === bookId);

  const filteredLibraryBooks = libraryBooks.filter(
    (book) => book && book.id && bookExists(book.id)
  );

  const filteredFavoriteBooks = favoriteBooks.filter(
    (book) => book && book.id && bookExists(book.id)
  );

  useEffect(() => {
    if (books.length === 0) {
      dispatch(clearFavorite(userId));
      dispatch(clearLibrary(userId));
    }
  }, [books, dispatch]);

  const handleUpdateProfile = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('كلمتا المرور غير متطابقتان', { autoClose: 3000 });
      return;
    }

    setLoading(true);

    try {
      let updatedUser = {
        username: newUsername,
        email: newEmail,
      };

      if (newPassword) {
        updatedUser.password = newPassword;
      }

      const response = await axios.put(
        `http://localhost:1337/api/users/${id}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (newProfileImage) {
        // رفع الصورة الجديدة
        const formData = new FormData();
        formData.append('files', newProfileImage);
        formData.append('refId', id);
        formData.append('ref', 'plugin::users-permissions.user');
        formData.append('field', 'profileImage');

        const uploadResponse = await axios.post(
          'http://localhost:1337/api/upload',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const updatedUserResponse = await axios.get(
          `http://localhost:1337/api/users/${id}?populate=profileImage`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const profileImageUrl = updatedUserResponse.data.profileImage
          ? updatedUserResponse.data.profileImage.url
          : null;

        dispatch(
          updateUser({
            username: updatedUserResponse.data.username,
            email: updatedUserResponse.data.email,
            token,
            profileImage: profileImageUrl,
          })
        );
      } else {
        dispatch(
          updateUser({
            username: response.data.username,
            email: response.data.email,
            token,
            profileImage: profileImage,
          })
        );
      }

      setLoading(false);
      toast.success('تم تحديث الملف الشخصي بنجاح', {
        autoClose: 3000,
        onClose: () => {
          navigate(
            `/profiles/${newUsername.toLowerCase().split(' ').join('-')}`
          );
        },
      });
    } catch (error) {
      setLoading(false);
      toast.error('حدث خطأ أثناء تحديث الملف الشخصي', { autoClose: 3000 });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'myworks':
        return <MyBooks />;
      case 'library':
        return filteredLibraryBooks.length === 0 ? (
          <div>
            <span className="text-sm font-semibold block mb-4">
              مكتبتي <span className="text-red-500">(0)</span>
            </span>
            <p className="bg-amber-100 p-2 mt-4">
              لا يوجد أي كتاب في مكتبتك بعد.
            </p>
          </div>
        ) : (
          <div>
            <span className="text-sm font-semibold block mb-4">
              مكتبتي{' '}
              <span className="text-red-500">
                ({filteredLibraryBooks.length})
              </span>
            </span>
            <div className="grid grid-cols-auto-small max-sm:grid-cols-2 gap-x-3 gap-y-5">
              <BookCard books={filteredLibraryBooks} height={270} />
            </div>
          </div>
        );
      case 'favorites':
        return filteredFavoriteBooks.length === 0 ? (
          <div>
            <span className="text-sm font-semibold block mb-4">
              المفضلات <span className="text-red-500">(0)</span>
            </span>
            <p className="bg-amber-100 p-2 mt-4">لا توجد مفضلات بعد.</p>
          </div>
        ) : (
          <div>
            <span className="text-sm font-semibold block mb-4">
              المفضلات{' '}
              <span className="text-red-500">
                ({filteredFavoriteBooks.length})
              </span>
            </span>
            <div className="grid grid-cols-auto-small max-sm:grid-cols-2 gap-x-3 gap-y-5">
              <BookCard books={filteredFavoriteBooks} height={270} />
            </div>
          </div>
        );
      case 'editProfile':
        return (
          <div>
            <div className="font-semibold">تعديل الملف الشخصي</div>
            <form className="mt-5" onSubmit={(e) => e.preventDefault()}>
              <span className="block mb-1 text-xs font-semibold">
                تغيير الصورة
              </span>
              <input
                type="file"
                className="text-xs"
                onChange={(e) => setNewProfileImage(e.target.files[0])}
              ></input>
              <div className="flex flex-col gap-3 my-4">
                <div className="w-full">
                  <label className="block mb-2 text-sm font-semibold">
                    الاسم
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="text-sm border px-2 py-[6px] rounded-md w-full caret-orange-800"
                  ></input>
                </div>
                <div className="w-full">
                  <label className="block mb-2 text-sm font-semibold">
                    البريد الالكتروني
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="text-sm border px-2 py-[6px] w-full rounded-md caret-orange-800"
                  ></input>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-1/2">
                  <label className="block mb-2 text-sm font-semibold">
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="text-sm border w-full rounded-md caret-orange-800 px-2 py-[6px]"
                  ></input>
                </div>
                <div className="w-1/2">
                  <label className="block mb-2 text-sm font-semibold">
                    تأكيد كلمة المرور
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="text-sm border w-full rounded-md caret-orange-800 px-2 py-[6px]"
                  ></input>
                </div>
              </div>
              <div className="mt-5">
                <button
                  className="bg-orange-800 hover:bg-orange-900 transition-all text-white px-4 py-2 rounded"
                  onClick={handleUpdateProfile}
                  disabled={loading}
                >
                  {loading ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    'تحديث الملف الشخصي'
                  )}
                </button>
              </div>
            </form>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <>
      <Navbar />
      <div className="pt-[85px] pb-3 px-3 bg-gray-100 min-h-[100vh] text-[#333]">
        <ToastContainer className="toast-container" />
        <div className="container">
          <div className="text-sm">
            <Link to="/" className="text-orange-800 font-semibold">
              الرئيسية
            </Link>{' '}
            / الصفحة الشخصية
          </div>
          <div className="flex flex-col md:flex-row gap-4 mt-6 ">
            <div className="md:w-[250px] bg-white border text-center px-6 py-7 text-sm h-[410px] flex flex-col justify-between">
              <div>
                <img
                  src={
                    profileImage
                      ? `http://localhost:1337${profileImage}`
                      : profilePhoto
                  }
                  alt="profilePhoto"
                  className="w-20 rounded-full mx-auto"
                ></img>
                <p className="font-semibold text-base mt-2">{username}</p>
              </div>
              <ul className="text-right">
                <li
                  className={`border-b py-[10px] px-1 cursor-pointer transition-all ${activeTab === 'myworks'
                      ? 'text-orange-800 font-semibold'
                      : ''
                    }`}
                  onClick={() => setActiveTab('myworks')}
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-book"
                    className="ml-2 text-base"
                  />
                  أعمالي
                </li>
                <li
                  className={`border-b py-[10px] px-1 cursor-pointer transition-all ${activeTab === 'library'
                      ? 'text-orange-800 font-semibold'
                      : ''
                    }`}
                  onClick={() => setActiveTab('library')}
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-bookmark"
                    className="ml-2 text-base"
                  />
                  مكتبتي
                </li>
                <li
                  className={`border-b py-[10px] px-1 cursor-pointer transition-all ${activeTab === 'favorites'
                      ? 'text-orange-800 font-semibold'
                      : ''
                    }`}
                  onClick={() => setActiveTab('favorites')}
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-heart"
                    className="ml-2 text-base"
                  />
                  المفضلة
                </li>
                <li
                  className={`border-b py-[10px] px-1 cursor-pointer transition-all ${activeTab === 'editProfile'
                      ? 'text-orange-800 font-semibold'
                      : ''
                    }`}
                  onClick={() => setActiveTab('editProfile')}
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-gear"
                    className="ml-2 text-base"
                  />
                  تعديل الحساب
                </li>
                <li className="border-b py-[10px] px-1">
                  <Link to="/logout" className="block">
                    <FontAwesomeIcon
                      icon="fa-solid fa-right-from-bracket"
                      className="ml-2 text-base"
                    />
                    تسجيل خروج
                  </Link>
                </li>
              </ul>
            </div>
            <div className="md:w-4/5 bg-white border p-4 ">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
