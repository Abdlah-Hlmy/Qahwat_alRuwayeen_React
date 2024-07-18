import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../rtk/slices/userSlice';

export default function PublishBook() {
  const dispatch = useDispatch();
  let showForm = true;
  const { id, authorInfo, token } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    authorName: '',
    bookTitle: '',
    Classification: '',
    description: '',
    authorInfo: authorInfo,
    bookCover: null,
    Link: null,
  });

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      authorInfo: authorInfo,
    }));
  }, [authorInfo]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.bookCover && formData.bookCover.type === 'image/webp') {
      toast.error("يرجى تغيير امتداد الصورة", {
        autoClose: 3000,
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append(
      'data',
      JSON.stringify({
        authorName: formData.authorName,
        bookTitle: formData.bookTitle,
        Classification: formData.Classification,
        description: formData.description,
        authorInfo: formData.authorInfo,
        addedBy: id,
      })
    );

    if (formData.bookCover) {
      formDataToSend.append('files.bookCover', formData.bookCover);
    }

    if (formData.Link) {
      formDataToSend.append('files.Link', formData.Link);
    }

    try {
      await axios.post('http://localhost:1337/api/books', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await axios.put(
        `http://localhost:1337/api/users/${id}`,
        { authorInfo: formData.authorInfo },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(updateUser({ authorInfo: formData.authorInfo }));

      toast.success('تم إارسال الكتاب بنجاح سوف يتم رفعة بمجرد مراجعتة', {
        autoClose: 3000,
        onClose: () => {
          window.location.reload();
        },
      });
    } catch (error) {
      toast.error('حدث خطأ أثناء إضافة الكتاب', {
        autoClose: 3000,
      });
    }
  };
  
  showForm = true

  if (!showForm) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-screen bg-slate-100">
          <p className="text-[26px] text-slate-700">النشر متوقف حاليًا</p>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-[100vh] bg-slate-100 pb-4">
      <Navbar />
      <div className="pt-[85px]">
        <ToastContainer className="toast-container" />
        <form onSubmit={handleSubmit}>
          <div className="bg-white mx-3 rounded-md p-4 pb-5">
            <h1 className="text-xl font-bold text-brown-700 text-center mb-5">
              اضافة كتاب جديد
            </h1>
            <div className="flex flex-col gap-[6px] text-[15px] text-[#333] mb-4">
              <label className="pr-1">
                إسم المؤلف{' '}
                <span className="text-red-500 text-xs">
                  * تأكد من أن يكون نفس الإسم في كل أعمالك
                </span>
              </label>
              <input
                className="border b px-2 py-[6px] focus:ring-1 focus:ring-brown-500"
                type="text"
                name="authorName"
                required
                value={formData.authorName}
                onChange={handleChange}
              />
            </div>
            <div className="flex max-sm:flex-col sm:items-center gap-3 mb-4">
              <div className="flex flex-col gap-[6px] text-[15px] text-[#333] w-full sm:w-1/2">
                <label className="pr-1">عنوان الكتاب</label>
                <input
                  className="border px-2 py-[6px] focus:ring-1 focus:ring-brown-500"
                  type="text"
                  name="bookTitle"
                  required
                  value={formData.bookTitle}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-[6px] text-[15px] text-[#333] w-full sm:w-1/2 ">
                <label className="pr-1">التصنيف</label>
                <input
                  className="border px-2 py-[6px] focus:ring-1 focus:ring-brown-500"
                  type="text"
                  name="Classification"
                  required
                  value={formData.Classification}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 text-[15px] text-[#333] mb-4">
              <label className="pr-1">نبذة عن الكتاب</label>
              <textarea
                className="border px-2 py-[6px] focus:ring-1 focus:ring-brown-500 min-h-28 resize-none"
                type="text"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2 text-[15px] text-[#333] mb-4">
              <label className="pr-1">نبذة عنك</label>
              <textarea
                className="border px-2 py-[6px] focus:ring-1 focus:ring-brown-500 min-h-28 resize-none"
                type="text"
                name="authorInfo"
                required
                value={formData.authorInfo || ''}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col md:flex-row md:items-center ">
              <div className="flex flex-col gap-[6px] text-[15px] text-[#333] mb-3 w-1/2">
                <label className="pr-1">غلاف الكتاب</label>
                <input
                  className="text-sm w-fit"
                  required
                  type="file"
                  name="bookCover"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-[6px] text-[15px] text-[#333] mb-3">
                <label className="pr-1">
                  رفع الكتاب بصيغة{' '}
                  <span className="font-semibold text-black">Pdf</span> أو أخرى
                </label>
                <input
                  className="text-sm"
                  required
                  type="file"
                  name="Link"
                  onChange={handleChange}
                />
              </div>
            </div>
            <button className="bg-orange-800 transition-all hover:bg-orange-900 text-white px-3 py-[6px] font-semibold rounded-md mt-4 mx-auto block">
              إضافة الكتاب
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
