import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { IPost } from "../types/types";
import { IPostComment } from "../types/types";

interface Post extends IPost {
  user_id: number;
  first_name: string;
  last_name: string;
  image: string;
}

interface InitialState {
  posts: Post[];
  post: Post;
  userPosts: Post[];
  postComments: IPostComment[];
}

const initialState: InitialState = {
  posts: [],
  post: {
    user_id: 0,
    first_name: "",
    last_name: "",
    image: "",
    text_content: "",
    created_at: 0,
    photo: "",
    type: "",
    id: 0,
    updated_at: 0,
  },
  userPosts: [],
  postComments: [],
};

export const fetchPostComments = createAsyncThunk(
  "post/fetchPostComments",
  async (postId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/comments/getPostComments/${postId}`
      );

      return response.data;
    } catch (err) {}
  }
);

export const fetchPost = createAsyncThunk(
  "post/fetchPost",
  async (postId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/posts/getPost/${postId}`
      );

      return response.data;
    } catch (err) {}
  }
);

export const fetchUserPosts = createAsyncThunk(
  "post/fetchUsersPosts",
  async (id: number) => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/posts/getUserPosts/${id}`
      );

      return response.data;
    } catch (err) {
      console.log(err);
    }
  }
);

export const fetchPosts = createAsyncThunk("post/fetchPosts", async () => {
  try {
    const response = await axios.get(
      `http://localhost:7000/api/posts/getPosts`
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
});

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchPosts.fulfilled,
      (state, action: PayloadAction<Post[]>) => {
        state.posts = action.payload.sort(
          (a: any, b: any) => b.created_at - a.created_at
        );
      }
    );

    builder.addCase(
      fetchUserPosts.fulfilled,
      (state, action: PayloadAction<Post[]>) => {
        state.userPosts = action.payload;
      }
    );

    builder.addCase(
      fetchPostComments.fulfilled,
      (state, action: PayloadAction<IPostComment[]>) => {
        state.postComments = action.payload;
      }
    );
    builder.addCase(fetchPost.fulfilled, (state, action) => {
      state.post = action.payload;
      console.log(state.post);
    });
  },
});

export const postActions = postSlice.actions;

export default postSlice.reducer;
