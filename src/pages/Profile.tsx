import React, { useEffect, useState } from "react";
import Friend from "../cards/Friend";
import { useParams } from "react-router-dom";
import { User } from "../types/types";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { GrFormCheckmark } from "react-icons/gr";
// import { IPost } from "../types/types";
import Post from "../cards/Post";
import { MdOutlinePhotoCamera } from "react-icons/md";
import AddPhoto from "../modals/photoModals/AddPhoto";
import AllFriends from "../modals/AllFriends";
import ImageSlider from "../modals/ImageSlider";
import { fetchUserPosts } from "../redux/postSlice";
import UserInfo from "../components/UserInfo";
import Navbar from "../components/Navbar";
import { sendFriendRequest } from "../redux/friendRequestSlice";
import ProfileInfo from "../components/ProfileInfo";
import ProfileFriends from "../components/ProfileFriends";
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
  const dispatch = useAppDispatch();
  const [openAddPhoto, setOpenAddPhoto] = useState(false);
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
  const [currentReqStatus, setCurrentReqStatus] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [openAddCoverPhoto, setOpenAddCoverPhoto] = useState(false);
  const [coverPhotoOpen, setOpenCoverPhoto] = useState(false);

  const { id } = useParams();

  const userId: number = id ? parseInt(id) : 0;

  // const rejectRequestHandler = async () => {
  //   try {
  //   } catch (err) {}
  // };

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
    dispatch(fetchUserPosts(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    const getFriendReqStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/followers/checkFriendRequestStatus/${userInfo.id}`
        );

        setFriendReqStatus(response.data);
      } catch (err) {}
    };

    getFriendReqStatus();
  }, [userInfo.id, currentReqStatus]);

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
          "http://localhost:7000/api/followers/checkFriendsStatus"
        );

        setFriendStatus(response.data);
      } catch (err) {}
    };

    getFriendStatus();
  }, []);

  const friendRequestHandler = async () => {
    dispatch(sendFriendRequest({ request: 1, receiverId: userInfo.id }));

    try {
      await axios.get(
        `http://localhost:7000/api/followers/sendFriendRequest/${userInfo.id}`
      );

      setCurrentReqStatus(true);
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
        <div className="relative h-[13rem] md:h-[20rem] lg:h-[30rem]">
          <img
            onClick={() => {
              userInfo.cover_image
                ? setOpenCoverPhoto(true)
                : setOpenCoverPhoto(false);
            }}
            src={userInfo.cover_image}
            alt=""
            className="h-full w-full hover:cursor-pointer"
          />

          {coverPhotoOpen && userInfo.cover_image !== null && (
            <ImageSlider
              userId={userId}
              setImageOpen={setOpenCoverPhoto}
              type={"cover"}
            />
          )}

          <button
            onClick={() => setOpenAddCoverPhoto(true)}
            className="absolute right-2 bottom-2 bg-white border-2 w-[3rem] rounded-md h-[2.5rem] flex items-center justify-center hover:bg-gray-200"
          >
            <MdOutlinePhotoCamera size={25} className="text-black" />
          </button>

          {openAddCoverPhoto && (
            <AddPhoto
              updateCoverPic={true}
              setOpenAddPhoto={setOpenAddCoverPhoto}
            />
          )}

          <div className="">
            <img
              onClick={() =>
                userInfo.image ? setImageOpen(true) : setImageOpen(false)
              }
              src={userInfo.image || profileDefault}
              alt=""
              className="absolute bottom-[-4rem] left-2 border-2 h-[8rem] w-[8rem] rounded-full hover:cursor-pointer"
            />
          </div>

          <button
            onClick={() => setOpenAddPhoto(true)}
            className="relative left-[7rem] bottom-[-1rem] bg-white border-2 w-[2.5rem] rounded-full h-[2.5rem] flex items-center justify-center hover:bg-gray-200"
          >
            <MdOutlinePhotoCamera size={25} className="text-black" />
          </button>

          {imageOpen && userInfo.image && (
            <ImageSlider
              userId={userId}
              setImageOpen={setImageOpen}
              type={"profile"}
            />
          )}

          {openAddPhoto && (
            <AddPhoto
              updateProfilePic={true}
              setOpenAddPhoto={setOpenAddPhoto}
            />
          )}
        </div>

        <div className="my-4 mt-20 ml-3 w-max text-center">
          <h2 className="text-2xl font-bold">
            {userInfo.first_name} {userInfo.last_name}
          </h2>

          <div className="">
            {loggedUserInfo.id !== userId &&
              !friendStatus &&
              friendReqStatus.status === false && (
                <button
                  onClick={friendRequestHandler}
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
