import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  token: "",
  email: "",
  id: "",
  profileImage: "",
  authorInfo: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.username;
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.id = action.payload.id;
      state.profileImage = action.payload.profileImage;
      state.authorInfo = action.payload.authorInfo;
    },
    updateUser: (state, action) => {
      if (action.payload.username !== undefined) {
        state.username = action.payload.username;
      }
      if (action.payload.email !== undefined) {
        state.email = action.payload.email;
      }
      if (action.payload.profileImage !== undefined) {
        state.profileImage = action.payload.profileImage;
      }
      if (action.payload.authorInfo !== undefined) {
        state.authorInfo = action.payload.authorInfo;
      }
    },
    clearUser: (state) => {
      state.username = "";
      state.token = "";
      state.email = "";
      state.id = "";
      state.profileImage = "";
      state.authorInfo = "";
    },
  },
});

export const { setUser, updateUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
