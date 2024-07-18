import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearUser } from '../rtk/slices/userSlice';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearUser());
    navigate('/');
  }, [dispatch, navigate]);

  return null;
}
