import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faWhatsapp,
  faTelegram,
} from '@fortawesome/free-brands-svg-icons';
import emailjs from 'emailjs-com';
import { toast, ToastContainer } from 'react-toastify';
import Footer from '../components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
      to_email: 'hlmy1200@gmail.com',
    };

    emailjs
      .send(
        'service_ap3atzs',
        'template_muwp7vq',
        templateParams,
        'Hxds6YuSu2ZLClm6j'
      )
      .then(
        () => {
          toast.success('تم إرسال الرسالة بنجاح!',
            {
              autoClose: 3000,
              onClose: () => {
                window.location.reload();
              }
            }
          );
        },
        () => {
          toast.error('فشل في إرسال الرسالة.', {
            autoClose: 3000
          });
        }
      );
  };

  return (
    <>
      <div className="min-h-[100vh] bg-slate-100 pb-5">
        <Navbar />
        <div className="container pt-[85px] px-3">
          <ToastContainer className="toast-container" />
          <div className="flex justify-between items-start">
            <div className="text-sm">
              <Link to="/" className="text-orange-800 font-semibold">
                الرئيسية
              </Link>{' '}
              / تواصل معنا
            </div>
            <div className="flex justify-center gap-3">
              <a
                href="https://www.facebook.com/groups/845315093060311"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faFacebook}
                  className="text-blue-600 transition-all hover:text-blue-700 text-[28px]"
                />
              </a>
              <a
                href="https://chat.whatsapp.com/KVnzC1btSR73Ai8x1JqCMs"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faWhatsapp}
                  className="text-green-500 transition-all hover:text-green-600 text-[28px]"
                />
              </a>
              <a
                href="https://t.me/novelrsqahwa"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faTelegram}
                  className="text-blue-500 transition-all hover:text-blue-600 text-[28px]"
                />
              </a>
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-4 mt-2">تواصل معنا</h2>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-md"
          >
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700">
                الاسم
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-[6px] text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-[6px] text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="subject" className="block text-gray-700">
                الموضوع
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-[6px] text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-700">
                الرسالة
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-[6px] min-h-32 resize-none text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-orange-800 transition-all hover:bg-orange-900 text-white px-4 py-[6px] font-semibold rounded-md "
            >
              إرسال
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
