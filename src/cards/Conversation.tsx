import React, { useEffect } from "react";
import { RxDotFilled } from "react-icons/rx";
import profileDefault from "../images/profile.jpg";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import { Message } from "../types/types";
import { chatActions } from "../redux/chatSlice";

interface Props {
  id: number;
  conversationId: number;
  firstName: string;
  lastName: string;
  image: string | null;
  lastMessage: string | null;
  senderId: number | null;
}

const Conversation = ({
  id,
  firstName,
  lastName,
  image,
  conversationId,
  lastMessage,
  senderId,
}: Props) => {
  const dispatch = useAppDispatch();
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const messages = useAppSelector((state) => state.chat.messages);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        dispatch(
          chatActions.setChat({
            userId: id,
            firstName,
            lastName,
            image,
            conversationId,
            open: true,
          })
        );
      }}
      key={id}
      className="flex items-center space-x-4 hover:bg-gray-100 rounded-md p-1 hover:cursor-pointer"
    >
      <div className="relative">
        <img
          className="border-2 w-[3rem] h-[3rem] rounded-full"
          alt=""
          src={image || profileDefault}
        />
        <RxDotFilled
          size={30}
          className="absolute bottom-[-0.3rem] right-[-0.7rem] text-green-600"
        />
      </div>

      <div className="">
        <h3 className="font-bold">
          {firstName} {lastName}
        </h3>
        {lastMessage && (
          <span className="text-[0.9rem]">
            {senderId === loggedUserInfo.id
              ? `You: ${lastMessage}`
              : lastMessage}
          </span>
        )}
      </div>
    </div>
  );
};

export default Conversation;
