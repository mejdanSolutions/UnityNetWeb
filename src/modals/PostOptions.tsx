import axios from "axios";
import React, { useEffect } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { useAppDispatch } from "../redux/hooks";
import {
  fetchPostComments,
  fetchPosts,
  fetchUserPosts,
  postActions,
} from "../redux/postSlice";

interface Props {
  setOpenOptions: React.Dispatch<React.SetStateAction<boolean>>;
  postId: number;
  userId: number;
  commentId?: number;
}

const PostOptions = ({ setOpenOptions, postId, userId, commentId }: Props) => {
  const dispatch = useAppDispatch();

  const deletePostHandler = async () => {
    try {
      await axios.delete(
        `http://localhost:7000/api/posts/deletePost/${postId}`
      );

      dispatch(fetchPosts());
      dispatch(fetchUserPosts(userId));
    } catch (err) {}
  };

  const deletePostCommentHandler = async () => {
    try {
      await axios.delete(
        `http://localhost:7000/api/comments/deletePostComment/${commentId}`
      );

      dispatch(fetchPostComments(postId));
      dispatch(postActions.setPostCommentDeleted(true));
    } catch (err) {}
  };

  useEffect(() => {
    window.addEventListener("click", (e: Event) => {
      setOpenOptions(false);
    });
  }, [setOpenOptions]);

  return (
    <div className="absolute right-2 top-7 w-[12rem] bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-2 rounded-md z-20">
      <div className="flex flex-col space-y-2">
        <button
          onClick={
            postId && commentId ? deletePostCommentHandler : deletePostHandler
          }
          className="flex items-center space-x-2 hover:text-red-500"
        >
          <AiFillDelete />
          <span>Delete {postId && commentId ? "comment" : "post"}</span>
        </button>

        <button className="flex items-center space-x-2 hover:text-green-500">
          <AiFillEdit />
          <span>Edit {postId && commentId ? "comment" : "post"}</span>
        </button>
      </div>
    </div>
  );
};

export default PostOptions;
