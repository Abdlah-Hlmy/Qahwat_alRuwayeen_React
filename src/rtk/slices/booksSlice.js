import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getBooks = createAsyncThunk(
  "books/getBooks",
  async () => {
    const { data } = await axios.get(
      " http://localhost:1337/api/books?filters[published][$eq]=true"
    );
    return data.data;
  }
)

const booksSlice = createSlice({
  name: "booksReducer",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBooks.fulfilled, (state, action) => {
      return action.payload
    })
  },
})

export default booksSlice.reducer