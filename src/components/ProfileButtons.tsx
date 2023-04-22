import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  getFriendRequests,
  sendFriendRequest,
} from "../redux/friendRequestSlice";
import { useAppDispatch } from "../redux/hooks";
import { User } from "../types/types";
import { useAppSelector } from "../redux/hooks";
import { GrFormCheckmark } from "react-icons/gr";
import {
  createNotification,
  sendNotification,
} from "../redux/notificationSlice";

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
  const friendRequests = useAppSelector((state) => state.request.requests);
  const notifications = useAppSelector(
    (state) => state.notification.notifications
  );

  console.log("friendReuqests", friendRequests);

  console.log(friendReqStatus, "friendReqStatus");

  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);

  const getFriendStatus = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/followers/checkFriendsStatus/${userInfo.id}`
      );

      setFriendStatus(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const friendRequestHandler = async () => {
    dispatch(
      sendFriendRequest({
        senderId: loggedUserInfo.id,
        receiverId: userInfo.id,
      })
    );

    try {
      await axios.get(
        `http://localhost:7000/api/followers/sendFriendRequest/${userInfo.id}`
      );

      getFriendReqStatus();
    } catch (err) {
      console.log(err);
    }
  };

  const unfriendHandler = async () => {
    try {
      await axios.get(
        `http://localhost:7000/api/followers/removeFromFriends/${userInfo.id}`
      );
      setFriendStatus(false);
    } catch (err) {
      console.log(err);
    }
  };

  const getFriendReqStatus = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/followers/checkFriendRequestStatus/${userInfo.id}`
      );

      setFriendReqStatus(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userInfo) {
      getFriendReqStatus();
    }
  }, [friendRequests, notifications]);

  useEffect(() => {
    if (userInfo) {
      getFriendStatus();
    }
  }, [userInfo, notifications]);

  const acceptRequestHandler = async () => {
    try {
      await axios.get(
        `http://localhost:7000/api/followers/acceptFriendRequest/${friendReqStatus.sender}`
      );
      dispatch(
        sendNotification({
          id: loggedUserInfo.id,
          first_name: loggedUserInfo.first_name,
          last_name: loggedUserInfo.last_name,
          image: loggedUserInfo.image,
          type: "friendRequest",
          created_at: new Date(),
          receiver_id: friendReqStatus.sender,
          post_id: null,
        })
      );
      dispatch(
        createNotification({
          receiverId: friendReqStatus.sender,
          type: "friendRequest",
        })
      );

      getFriendStatus();
      setFriendReqStatus({ status: false, receiver: 0, sender: 0 });
      dispatch(getFriendRequests());
    } catch (err) {}
  };

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
