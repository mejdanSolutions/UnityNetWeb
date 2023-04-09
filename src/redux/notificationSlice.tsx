import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { create } from "domain";
import { Notification } from "../types/types";
import socket from "../services/socket";
import { useAppSelector } from "./hooks";

interface Args {
  receiverId: number;
  type: string;
  postId?: number;
}

interface InitialState {
  notifications: Notification[];
}

const initialState: InitialState = {
  notifications: [],
};

export const createNotification = createAsyncThunk(
  "notification/createNotification",
  async ({ receiverId, type, postId }: Args) => {
    try {
      if (postId) {
        await axios.post(
          `http://localhost:7000/api/notification/createNotification/${receiverId}/${postId}`,
          { type }
        );
      } else {
        await axios.post(
          `http://localhost:7000/api/notification/createNotification/${receiverId}`,
          { type }
        );
      }
    } catch (err) {}
  }
);

export const getNotifications = createAsyncThunk(
  "notification/getNotifications",
  async () => {
    try {
      const response = await axios.get(
        "http://localhost:7000/api/notification/getNotifications"
      );

      return response.data;
    } catch (err) {}
  }
);

export const subscribeToNotifications = () => (dispatch: any) => {
  socket.on("getNotification", (data) => {
    dispatch(notificationsActions.saveReceivedNotifications(data));
  });
};

export const unsubscribeFromNotifications = () => () => {
  socket.off("getNotification");
};

export const sendNotification =
  (notification: Notification) => (dispatch: any) => {
    socket.emit("sendNotification", notification);
  };

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    saveReceivedNotifications(state, action) {
      state.notifications.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNotifications.fulfilled, (state, action) => {
      state.notifications = action.payload;
    });
  },
});

export const notificationsActions = notificationSlice.actions;

export default notificationSlice.reducer;
