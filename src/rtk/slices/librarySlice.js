import { createSlice } from "@reduxjs/toolkit";

const librarySlice = createSlice({
  name: "library",
  initialState: {},
  reducers: {
    addToLibrary: (state, action) => {
      const { userId, book } = action.payload;
      if (!userId || !book) return;

      if (!state[userId]) {
        state[userId] = [];
      }
      const bookFind = state[userId].find((item) => item.id === book.id);
      if (!bookFind) {
        state[userId].push(book);
      }
    },
    deleteFromLibrary: (state, action) => {
      const { userId, bookId } = action.payload;
      if (!userId || !bookId) return;

      if (state[userId]) {
        state[userId] = state[userId].filter((book) => book.id !== bookId);
      }
    },
    clearLibrary: (state, action) => {
      const { userId } = action.payload;
      if (!userId) return;

      state[userId] = [];
    },
  },
});

export const { addToLibrary, deleteFromLibrary, clearLibrary } = librarySlice.actions;
export default librarySlice.reducer;
