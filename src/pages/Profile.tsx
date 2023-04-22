import React, { useEffect, useState } from "react";
import Friend from "../cards/Friend";
import { useParams } from "react-router-dom";
import { User } from "../types/types";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { GrFormCheckmark } from "react-icons/gr";
// import { IPost } from "../types/types";
import Post from "../cards/Post";

import { fetchUserPosts } from "../redux/postSlice";
import UserInfo from "../components/UserInfo";
import Navbar from "../components/Navbar";
import { sendFriendRequest } from "../redux/friendRequestSlice";
import ProfileInfo from "../components/ProfileInfo";
import ProfileFriends from "../components/ProfileFriends";
import ProfileHeader from "../components/ProfileHeader";
const profileDefault = require("../images/profile.jpg");

// interface IUPost extends IPost {
//   id: number;
//   first_name: string;
//   last_name: string;
// }

interface Request {
  status: boolean;
  receiver: number;
  sender: number;
}

interface IUser extends User {
  cover_image: string;
}

const Profile = () => {
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const [userInfo, setUserInfo] = useState<IUser>({
    id: 0,
    first_name: "",
    last_name: "",
    image: "",
    cover_image: "",
  });
  const [friendStatus, setFriendStatus] = useState(false);

  const posts = useAppSelector((state) => state.post.userPosts);
  const [friendReqStatus, setFriendReqStatus] = useState<Request>({
    status: false,
    receiver: 0,
    sender: 0,
  });

  console.log(friendStatus);

  const { id } = useParams();

  const userId: number = id ? parseInt(id) : 0;

  // const rejectRequestHandler = async () => {
  //   try {
  //   } catch (err) {}
  // };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
        setPage(page + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page]);

  const acceptRequestHandler = async () => {
    try {
      await axios.get(
        `http://localhost:7000/api/followers/acceptFriendRequest/${friendReqStatus.sender}`
      );

      setFriendStatus(true);
      setFriendReqStatus({ status: false, receiver: 0, sender: 0 });
    } catch (err) {}
  };

  useEffect(() => {
    dispatch(fetchUserPosts({ userId, page }));
  }, [page]);

  const getFriendReqStatus = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/followers/checkFriendRequestStatus/${userId}`
      );

      setFriendReqStatus(response.data);
    } catch (err) {}
  };

  useEffect(() => {
    getFriendReqStatus();
  }, []);

  const unfriendHandler = async () => {
    try {
      await axios.get(
        `http://localhost:7000/api/followers/removeFromFriends/${userInfo.id}`
      );
      setFriendStatus(false);
    } catch (err) {}
  };

  useEffect(() => {
    const getFriendStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/followers/checkFriendsStatus/${userInfo?.id}`
        );

        setFriendStatus(response.data);
      } catch (err) {}
    };

    getFriendStatus();
  }, [userId, userInfo]);

  const friendRequestHandler = async () => {
    dispatch(sendFriendRequest({ request: 1, receiverId: userInfo.id }));

    try {
      await axios.get(
        `http://localhost:7000/api/followers/sendFriendRequest/${userInfo.id}`
      );

      getFriendReqStatus();
    } catch (err) {}
  };

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get(
        `http://localhost:7000/api/users/getUserInfo/${id}`
      );

      setUserInfo(response.data);
    };

    getUser();
  }, [id]);

  return (
    <>
      <Navbar />
      <section className="max-w-5xl mx-auto shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-gray-100">
        <ProfileHeader userInfo={userInfo} />
        <div className="my-4 mt-20 ml-3 w-max text-center">
          <h2 className="text-2xl font-bold">
            {userInfo.first_name} {userInfo.last_name}
          </h2>

          <div className="">
            {loggedUserInfo.id !== userId &&
              !friendStatus &&
              friendReqStatus.status === false && (
                <button
                  onClick={friendRequestHandler} //
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-md font-bold hover:bg-blue-600"
                >
                  Add to friends
                </button>
              )}

            {friendStatus && loggedUserInfo.id !== userId && (
              <div className="flex items-center space-x-2">
                <GrFormCheckmark />
                <span>Friends</span>
                <button
                  onClick={unfriendHandler}
                  type="submit"
                  className="bg-blue-500 text-white p-1 rounded-md font-bold hover:bg-blue-600"
                >
                  Unfriend
                </button>
              </div>
            )}

            {friendReqStatus.status === true &&
              friendReqStatus.receiver === userId &&
              loggedUserInfo.id !== userId && (
                <div className="flex items-center space-x-2">
                  {" "}
                  <GrFormCheckmark className="" />
                  <span className="text-blue-600">Friend request sent</span>
                </div>
              )}

            {friendReqStatus.status &&
              loggedUserInfo.id !== userId &&
              friendReqStatus.sender === userId && (
                <div className="flex space-x-2">
                  <button
                    onClick={acceptRequestHandler}
                    type="submit"
                    className="bg-blue-500 text-white p-1 rounded-md font-bold hover:bg-blue-600"
                  >
                    Accept
                  </button>

                  <button className="border-2 border-blue-500 rounded-md text-blue-600 p-1">
                    Reject
                  </button>
                </div>
              )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="w-full mt-6">
            <ProfileInfo />

            <ProfileFriends friendStatus={friendStatus} userId={userId} />
          </div>

          <div className="">
            {posts.length === 0 && (
              <span className="text-center text-blue-600">
                There is no existing posts
              </span>
            )}
            {posts.map((post: any) => (
              <Post
                key={post.id}
                postText={post.text_content}
                type={post.type}
                postPhoto={post.photo}
                postId={post.id}
                userId={post.user_id}
                createdAt={post.created_at}
                firstName={post.first_name}
                lastName={post.last_name}
                image={post.image}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
