import React, { useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { addUser, authActions } from "./redux/authSlice";
import Profile from "./pages/Profile";
import { getLoggedUserInfo } from "./redux/authSlice";
import {
  getFriendRequestsCount,
  subscribeToFriendRequests,
  unsubscribeFromFriendRequests,
} from "./redux/friendRequestSlice";

import {
  getSeen,
  subscribeToMessages,
  unsubscribeFromMessages,
  unsubscribeFromSeen,
} from "./redux/chatSlice";
import socket, { onLoginSuccess } from "./services/socket";
import {
  subscribeToNotifications,
  unsubscribeFromNotifications,
} from "./redux/notificationSlice";
import PreviewPost from "./pages/PreviewPost";

axios.defaults.withCredentials = true;

function App() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const messages = useAppSelector((state) => state.chat.messages);

  useEffect(() => {
    dispatch(getFriendRequestsCount());
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(getSeen());

  //   return () => dispatch(unsubscribeFromSeen());
  // }, [dispatch]);

  useEffect(() => {
    dispatch(addUser(loggedUserInfo.id));
  }, [dispatch, loggedUserInfo]);

  useEffect(() => {
    dispatch(getSeen());
    dispatch(subscribeToNotifications());
    dispatch(subscribeToMessages());
    dispatch(subscribeToFriendRequests());

    return () => {
      dispatch(unsubscribeFromMessages());
      dispatch(unsubscribeFromFriendRequests());
      dispatch(unsubscribeFromNotifications());
      socket.disconnect();
    };
  }, [dispatch]);

  useEffect(() => {
    const getLoginStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/auth/getLoginStatus`
        );

        dispatch(authActions.setLogin(response.data.status));

        if (response.data.status) {
          onLoginSuccess(response.data.token);
          dispatch(getLoggedUserInfo());
        }
      } catch (err) {}
    };

    getLoginStatus();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/previewPost/:postId" element={<PreviewPost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
