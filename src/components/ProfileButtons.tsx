import React, { useState, useEffect } from "react";
import axios from "axios";
import { sendFriendRequest } from "../redux/friendRequestSlice";
import { useAppDispatch } from "../redux/hooks";
import { User } from "../types/types";
import { useAppSelector } from "../redux/hooks";
import { GrFormCheckmark } from "react-icons/gr";

interface Request {
  status: boolean;
  receiver: number;
  sender: number;
}

interface Props {
  setFriendStatus: React.Dispatch<React.SetStateAction<boolean>>;
  friendStatus: boolean;
  userInfo: User;
}

const ProfileButtons = ({ setFriendStatus, friendStatus, userInfo }: Props) => {
  const dispatch = useAppDispatch();
  const [friendReqStatus, setFriendReqStatus] = useState<Request>({
    status: false,
    receiver: 0,
    sender: 0,
  });

  console.log("userId", userInfo.id);

  console.log(friendReqStatus);

  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);

  const acceptRequestHandler = async () => {
    try {
      await axios.get(
        `http://localhost:7000/api/followers/acceptFriendRequest/${friendReqStatus.sender}`
      );

      setFriendStatus(true);
      setFriendReqStatus({ status: false, receiver: 0, sender: 0 });
    } catch (err) {}
  };

  const friendRequestHandler = async () => {
    dispatch(sendFriendRequest(userInfo.id));

    try {
      await axios.get(
        `http://localhost:7000/api/followers/sendFriendRequest/${userInfo.id}`
      );

      getFriendReqStatus();
    } catch (err) {}
  };

  const unfriendHandler = async () => {
    try {
      await axios.get(
        `http://localhost:7000/api/followers/removeFromFriends/${userInfo.id}`
      );
      setFriendStatus(false);
    } catch (err) {}
  };

  const getFriendReqStatus = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/followers/checkFriendRequestStatus/${userInfo.id}`
      );

      setFriendReqStatus(response.data);
    } catch (err) {}
  };

  useEffect(() => {
    if (loggedUserInfo.id !== userInfo.id) {
      getFriendReqStatus();
    }
  }, [loggedUserInfo, userInfo]);

  useEffect(() => {
    const getFriendStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/followers/checkFriendsStatus/${userInfo.id}`
        );

        setFriendStatus(response.data);
      } catch (err) {}
    };

    getFriendStatus();
  }, [userInfo]);

  return (
    <div className="ml-5">
      {loggedUserInfo.id !== userInfo.id &&
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

      {friendStatus && loggedUserInfo.id !== userInfo.id && (
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

      {friendReqStatus.status &&
        friendReqStatus.sender === loggedUserInfo.id && (
          <div className="flex items-center space-x-1">
            {" "}
            <GrFormCheckmark className="" />
            <span className="text-blue-600">Friend request sent</span>
          </div>
        )}

      {friendReqStatus.status &&
        friendReqStatus.receiver === loggedUserInfo.id && (
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
  );
};

export default ProfileButtons;
