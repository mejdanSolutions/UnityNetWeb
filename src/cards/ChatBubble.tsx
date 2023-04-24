import React, { useState } from "react";
import profileDefault from "../images/profile.jpg";
import { AiOutlineClose } from "react-icons/ai";
import { useAppDispatch } from "../redux/hooks";
import { chatActions } from "../redux/chatSlice";
import moment from "moment-timezone";

interface Props {
  userId: number;
  firstName: string;
  lastName: string;
  image: string;
  conversationId: number;
}

const ChatBubble = ({
  userId,
  firstName,
  lastName,
  image,
  conversationId,
}: Props) => {
  const [isHovering, setIsHovering] = useState(false);
  const dispatch = useAppDispatch();

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        dispatch(
          chatActions.setChat({
            userId,
            firstName,
            lastName,
            image,
            conversationId,
            open: true,
          })
        );
      }}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      className="hover:cursor-pointer"
    >
      <img
        src={image || profileDefault}
        alt=""
        className="w-[3rem] h-[3rem] border-2 rounded-[100%] hover:cursor-pointer my-2"
      />

      {isHovering && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(chatActions.closeChat(userId));
            }}
            className="absolute top-0 right-0 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-full w-[1rem] h-[1rem] text-center"
          >
            <AiOutlineClose />
          </button>

          <div className="absolute top-[25%] right-[3.5rem] w-max py-2 px-2 text-[0.9rem] text-black bg-white rounded-md h-max">
            <span className="font-bold">
              {firstName} {lastName}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBubble;
