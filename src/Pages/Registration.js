import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import logo from '../imags/logo.jpg';

export default function Registration() {
  const initialUser = { username: '', password: '', email: '' };
  const [user, setUser] = useState(initialUser);
  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setUser((currentUser) => ({
      ...currentUser,
      [name]: value,
    }));
  };

  const handleSignup = async () => {
    const url = `http://localhost:1337/api/auth/local/register`;
    try {
      if (user.username && user.password && user.email) {
        const res = await axios.post(url, user);
        if (res.data) {
          setUser(initialUser);
          navigate('/login');
        }
      }
    } catch (error) {
      toast.error("إسم المستخدم أو البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center max-sm:justify-start items-center p-5 max-sm:pt-9">
      <img src={logo} alt="logo" className=" w-24  h-24 mb-2" />
      <ToastContainer className="toast-container" />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm border border-brown-500">
        <h2 className="text-2xl font-bold mb-6 text-center text-brown-700">
          إنشاء حساب جديد
        </h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block mb-2 text-sm text-brown-700" htmlFor="name">
              الاسم كامل
            </label>
            <input
              type="text"
              id="name"
              name="username"
              value={user.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-brown-500"
              required
            />
          </div>
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
              name="email"
              value={user.email}
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
            onClick={handleSignup}
            className="w-full py-2 bg-brown-500 text-white rounded-lg hover:bg-brown-700 transition duration-300"
          >
            إنشاء الحساب
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-brown-600">
          لديك حساب بالفعل؟{' '}
          <Link to="/login" className="text-brown-500 hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
