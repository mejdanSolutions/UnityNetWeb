import React, { useState } from "react";
import { SlPicture } from "react-icons/sl";
import { BsEmojiSmile } from "react-icons/bs";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchPosts } from "../redux/postSlice";
import AddPhoto from "./photoModals/AddPhoto";
import profileDefault from "../images/profile.jpg";

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreatePost = ({ setOpen }: Props) => {
  const [openAddPhoto, setOpenAddPhoto] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [message, setMessage] = useState("");
  const userInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const dispatch = useAppDispatch();

  const createPostHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textContent) {
      setMessage("Please write your post");
      return;
    }

    const formData = {
      textContent,
    };

    try {
      await axios.post(`http://localhost:7000/api/posts/createPost`, formData);

      dispatch(fetchPosts(1));
      setOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-center fixed top-0 bottom-0 left-0 right-0 bg-[rgb(0,0,0,0.5)] z-20">
      <form
        onSubmit={createPostHandler}
        className="relative bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md mx-3 p-3 w-[30rem]"
      >
        <h2 className="text-2xl font-bold text-center">Create Post</h2>
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-2 font-bold bg-gray-200 rounded-full w-[2rem] h-[2rem] hover:bg-gray-300"
        >
          X
        </button>
        <div className="flex items-center space-x-2 my-4">
          <img
            alt=""
            src={userInfo.image || profileDefault}
            className="w-[3rem] h-[3rem] rounded-full border-2"
          />
          <h3 className="font-bold">
            {userInfo.first_name} {userInfo.last_name}
          </h3>
        </div>

        <div className="my-4">
          <textarea
            onChange={(e) => setTextContent(e.target.value)}
            className="bg-gray-100 rounded-lg outline-none w-full p-2"
            value={textContent}
            placeholder="Whats on your mind?"
          />
        </div>

        {message && <span className="text-red-500">{message}</span>}

        <div className="relative flex space-x-2 my-4">
          <button onClick={() => setOpenAddPhoto(true)}>
            {" "}
            <SlPicture size={25} />
          </button>
          <button>
            <BsEmojiSmile size={25} />
          </button>

          {openAddPhoto && (
            <AddPhoto setOpen={setOpen} setOpenAddPhoto={setOpenAddPhoto} />
          )}
        </div>

        <button
          type="submit"
          className="bg-gray-200 rounded-md flex items-center space-x-2 px-3 py-1 hover:bg-gray-300"
        >
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
