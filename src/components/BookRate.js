import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

const calculateAverageRating = (ratings) => {
  const total = ratings.reduce((acc, rating) => acc + rating, 0);
  return total / ratings.length;
};

export default function BookRate({ bookId }) {
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get(`http://localhost:1337/api/books/${bookId}`);
        const ratings = response.data.data.attributes.ratings || [];
        const average = calculateAverageRating(ratings);
        setAverageRating(average);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };

    fetchRatings();
  }, [bookId]);

  return (
    <div dir='ltr'>
      <Stack spacing={1}>
        <Rating name="half-rating-read" value={averageRating} size="small" precision={0.5} readOnly />
      </Stack>
    </div>
  );
}
