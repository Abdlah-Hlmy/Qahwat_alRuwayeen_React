import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './slices/userSlice';
import booksReducer from './slices/booksSlice';
import favoriteSlice from './slices/favoriteSlice';
import librarySlice from './slices/librarySlice';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['books'],
};

const rootReducer = combineReducers({
  user: userReducer,
  books: booksReducer,
  favoriteBooks: favoriteSlice,
  libraryBooks: librarySlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
