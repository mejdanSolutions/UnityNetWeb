import React, { useEffect, useState, useRef } from "react";
import { RxDotFilled } from "react-icons/rx";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { User } from "../../types/types";
import axios from "axios";
import profileDefault from "../../images/profile.jpg";
import Chat from "./Chat";
import { authActions } from "../../redux/authSlice";
import { io } from "socket.io-client";
import { chatActions } from "../../redux/chatSlice";

interface Props {}

const FriendsChat = () => {
  const [friends, setFriends] = useState<User[]>([]);
  const dispatch = useAppDispatch();

  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);

  useEffect(() => {
    const getUserFriends = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/users/getUserFriends/${loggedUserInfo.id}`
        );

        setFriends(response.data);
      } catch (err) {}
    };

    getUserFriends();
  }, [loggedUserInfo]);

  return (
    <div className="hidden md:block justify-self-end mt-5">
      <div className="flex items-center space-x-2 m-2 p-1">
        <h2 className="font-bold">Contacts</h2>
      </div>

      <div className="m-2 mt-5">
        {friends.map((friend) => (
          <div
            onClick={(e) => {
              e.stopPropagation();
              dispatch(
                chatActions.setChat({
                  userId: friend.id,
                  open: true,
                })
              );
            }}
            key={friend.id}
            className="flex items-center justify-between hover:bg-gray-100 hover:cursor-pointer rounded-md p-1"
          >
            <div className="flex items-center space-x-2">
              <img
                src={friend.image || profileDefault}
                alt=""
                className="rounded-full border-2 w-[2.5rem] h-[2.2rem]"
              />
              <span className="font-bold">{friend.first_name}</span>
              <span className="font-bold">{friend.last_name}</span>
            </div>

            <RxDotFilled size={25} className="text-green-600" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsChat;
