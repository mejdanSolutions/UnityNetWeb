import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import socket from "../services/socket";
import { User } from "../types/types";

interface Request {
  request: number;
  receiverId: number;
}

export const getFriendRequests = createAsyncThunk(
  "auth/getFriendRequests",
  async () => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/followers/getFriendRequests`
      );

      return response.data;
    } catch (err) {}
  }
);

export const getFriendRequestsCount = createAsyncThunk(
  "auth/getFriendRequestsCount",
  async () => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/followers/getFriendRequestsCount`
      );

      return response.data;
    } catch (err) {}
  }
);

interface InitialState {
  requests: User[];
  requestCount: number;
}

const initialState: InitialState = {
  requests: [],
  requestCount: 0,
};

// export const sendFriendRequest = createAsyncThunk(
//   "sendFriendRequest",
//   async function ({ request, receiverId }: Request, { dispatch }) {
//     window.socketClient.emit("sendFriendRequest", { request, receiverId });
//   }
// );

export const sendFriendRequest = (receiverId: number) => (dispatch: any) => {
  socket.emit("sendFriendRequest", { receiverId });
};

// export const subscribeToFriendRequests = createAsyncThunk(
//   "subscribeToFriendRequests",
//   async function () {
//     window.socketClient.on("getFriendRequest");
//   }
// );

export const subscribeToFriendRequests = () => (dispatch: any) => {
  socket.on("getFriendRequest", (data) => {
    dispatch(friendRequestActions.saveReceivedRequest(data));
  });
};

// export const unsubscribeFromFriendRequests = createAsyncThunk(
//   "subscribeToFriendRequests",
//   async function () {
//     window.socketClient.off("getFriendRequest");
//   }
// );

export const unsubscribeFromFriendRequests = () => () => {
  socket.off("getFriendRequest");
};

// export const createFriendRequestNotification = ({senderId, receiverId, }) => () => {

// }

const friendRequestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    saveReceivedRequest(state, action) {
      state.requestCount += 1;
      state.requests.push(action.payload);

      console.log("socket request count", state.requestCount);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getFriendRequests.fulfilled,
      (state, action: PayloadAction<User[]>) => {
        state.requests = action.payload;
      }
    );
    builder.addCase(getFriendRequestsCount.fulfilled, (state, action) => {
      state.requestCount = action.payload.requestCount;
      console.log("backend request count", state.requestCount);
    });
  },
});

export const friendRequestActions = friendRequestSlice.actions;

export default friendRequestSlice.reducer;
