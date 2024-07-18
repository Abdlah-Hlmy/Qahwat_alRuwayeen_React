import React from 'react';

const DeletePopup = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 border text-center">
        <h2 className="text-xl font-bold mb-3">{title}</h2>
        <p className="mb-5">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={onConfirm}
            className="bg-blue-500 transition-all text-white px-4  rounded hover:bg-blue-600"
          >
            نعم, إحذفه
          </button>
          <button
            onClick={onCancel}
            className="bg-red-500 transition-all text-white px-4 py-[6px] rounded mr-2 hover:bg-red-600"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
