import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
  name: "favorite",
  initialState: {},
  reducers: {
    addToFavorite: (state, action) => {
      const { userId, book } = action.payload;
      if (!userId || !book || !book.id) {
        console.error('Invalid payload for addToFavorite:', action.payload);
        return; 
      }

      if (!state[userId]) {
        state[userId] = [];
      }
      const bookFind = state[userId].find((item) => item?.id === book.id);
      if (!bookFind) {
        state[userId].push(book);
      }
    },
    deleteFromFavorite: (state, action) => {
      const { userId, bookId } = action.payload;
      if (!userId || !bookId) {
        console.error('Invalid payload for deleteFromFavorite:', action.payload);
        return;
      }

      if (state[userId]) {
        state[userId] = state[userId].filter((book) => book?.id !== bookId);
      }
    },
    clearFavorite: (state, action) => {
      const { userId } = action.payload;
      if (!userId) {
        console.error('Invalid payload for clearFavorite:', action.payload);
        return;
      }

      state[userId] = [];
    },
  },
});

export const { addToFavorite, deleteFromFavorite, clearFavorite } = favoriteSlice.actions;
export default favoriteSlice.reducer;
