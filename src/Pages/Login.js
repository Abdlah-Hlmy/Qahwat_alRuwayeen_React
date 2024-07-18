import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../rtk/slices/userSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../imags/logo.jpg';

export default function Login() {
  const initialUser = { identifier: '', password: '' };
  const [user, setUserState] = useState(initialUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setUserState((currentUser) => ({
      ...currentUser,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const url = 'http://localhost:1337/api/auth/local';
    try {
      if (user.identifier && user.password) {
        const { data } = await axios.post(url, user);
        if (data.jwt) {
          const userDataResponse = await axios.get(
            `http://localhost:1337/api/users/${data.user.id}?populate=profileImage`,
            {
              headers: {
                Authorization: `Bearer ${data.jwt}`,
              },
            }
          );

          const profileImageUrl = userDataResponse.data.profileImage
            ? userDataResponse.data.profileImage.url
            : null;

          dispatch(
            setUser({
              username: userDataResponse.data.username,
              token: data.jwt,
              email: userDataResponse.data.email,
              id: userDataResponse.data.id,
              profileImage: profileImageUrl,
              authorInfo: userDataResponse.data.authorInfo,
            })
          );
          navigate('/');
        }
      }
    } catch (error) {
      toast.error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
  };


  return (
    <div className="h-screen flex flex-col justify-center max-sm:justify-start items-center p-5 max-sm:pt-9">
      <img src={logo} alt="logo" className="w-24 h-24 mb-2" />
      <ToastContainer className="toast-container" />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm border border-brown-500">
        <h2 className="text-2xl font-bold mb-6 text-center text-brown-700">
          مرحبًا بكم في قهوة الروائيين
        </h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label
              className="block mb-2 text-sm text-brown-700"
              htmlFor="email"
            >
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              name="identifier"
              value={user.identifier}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-brown-500"
              required
            />
          </div>
          <div>
            <label
              className="block mb-2 text-sm text-brown-700"
              htmlFor="password"
            >
              كلمة المرور
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-brown-500"
              required
            />
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full py-2 bg-brown-500 text-white rounded-lg hover:bg-brown-700 transition duration-300"
          >
            تسجيل الدخول
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-brown-600">
          ليس لديك حساب؟{' '}
          <Link to="/register" className="text-brown-500 hover:underline">
            إنشاء حساب جديد
          </Link>
        </p>
      </div>
    </div>
  );
}
