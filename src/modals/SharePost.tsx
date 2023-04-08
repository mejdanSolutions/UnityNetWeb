import React, { useState } from "react";
import { useAppSelector } from "../redux/hooks";
import axios from "axios";

interface Props {
  setOpenSharePost: React.Dispatch<React.SetStateAction<boolean>>;
  postId: number;
}

const SharePost = ({ setOpenSharePost, postId }: Props) => {
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const [description, setDescription] = useState("");

  const sharePostHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(`http://localhost:7000/api/posts/sharePost/${postId}`, {
        description,
      });

      setDescription("");
    } catch (err) {}
  };

  return (
    <div className="flex items-center justify-center fixed top-0 bottom-0 left-0 right-0 bg-[rgb(0,0,0,0.5)] z-20">
      <form
        onSubmit={sharePostHandler}
        className="relative bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md mx-3 p-3 w-[30rem]"
      >
        <h2 className="text-2xl font-bold text-center">Share Post</h2>
        <button
          onClick={() => setOpenSharePost(false)}
          className="absolute top-3 right-2 font-bold bg-gray-200 rounded-full w-[2rem] h-[2rem] hover:bg-gray-300"
        >
          X
        </button>
        <div className="flex items-center space-x-2 my-4">
          <img
            alt=""
            src=""
            className="w-[3rem] h-[3rem] rounded-full border-2"
          />
          <h3 className="font-bold">
            {loggedUserInfo.first_name} {loggedUserInfo.last_name}
          </h3>
        </div>

        <div className="my-4">
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            className="bg-gray-100 rounded-lg outline-none w-full p-2"
            value={description}
            placeholder="Add description"
          />
        </div>

        <button
          type="submit"
          className="bg-gray-200 rounded-md flex items-center space-x-2 px-3 py-1 hover:bg-gray-300"
        >
          Share Post
        </button>
      </form>
    </div>
  );
};

export default SharePost;
