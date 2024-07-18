import React, { useState } from 'react';
import axios from 'axios';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

const RatePopup = ({ onClose, bookId }) => {
  const [rating, setRating] = useState(0);

  const handleRate = async () => {
    try {
      const response = await axios.get(`http://localhost:1337/api/books/${bookId}`);
      const currentRatings = response.data.data.attributes.ratings || [];
      const updatedRatings = [...currentRatings, rating];

      await axios.put(
        `http://localhost:1337/api/books/${bookId}`,
        {
          data: {
            ratings: updatedRatings,
          }
        }
      );
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-4 w-96 border text-center relative">
        <h2 className="text-xl font-bold mb-3">تقييم الكتاب</h2>
        <div className='flex justify-center' dir='ltr'>
          <Stack spacing={1}>
            <Rating
              name="half-rating"
              size="large"
              precision={0.5}
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
            />
          </Stack>
        </div>
        <div className="flex justify-end gap-[6px] mt-5 text-[13px]">
          <button
            onClick={handleRate}
            className="bg-[#333] text-white px-3 py-1 transition-all hover:bg-black rounded-full"
          >
            إضافة
          </button>
          <button
            onClick={onClose}
            className="bg-[#333] text-white px-3 py-1 transition-all hover:bg-black rounded-full"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatePopup;
