import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import socket from "../services/socket";
import { User } from "../types/types";

interface InitialState {
  isLoggedIn: boolean;
  loggedUserInfo: User;
}

const initialState: InitialState = {
  isLoggedIn: false,
  loggedUserInfo: {
    id: 0,
    first_name: "",
    last_name: "",
    image: "",
    cover_image: "",
  },
};

export const addUser = (userId: number) => (dispatch: any) => {
  socket.emit("addUser", userId);
};

export const getLoggedUserInfo = createAsyncThunk(
  "auth/getLoggedUserInfo",
  async () => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/users/getLoggedUserInfo`
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin(state, action) {
      state.isLoggedIn = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getLoggedUserInfo.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.loggedUserInfo = action.payload;
      }
    );
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
