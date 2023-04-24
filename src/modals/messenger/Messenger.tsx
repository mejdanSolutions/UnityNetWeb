import React, { useState, useEffect } from "react";
import axios from "axios";
import { Message, User } from "../../types/types";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Conversation from "../../cards/Conversation";
import { fetchMessages } from "../../redux/chatSlice";
import { Conversation as Conv } from "../../types/types";

interface Props {
  setOpenMessages: React.Dispatch<React.SetStateAction<boolean>>;
}

const Messenger = ({ setOpenMessages }: Props) => {
  const [conversations, setConversations] = useState<Conv[]>([]);
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  // const [lastMessages, setLastMessages] = useState<Message[]>([]);
  const messages = useAppSelector((state) => state.chat.messages);

  // useEffect(() => {
  //   dispatch(fetchMessages(loggedUserInfo.id));
  // }, [loggedUserInfo]);

  // useEffect(() => {
  //   const getLastMessages = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:7000/api/messages/getLastMessages`
  //       );

  //       setLastMessages(response.data);
  //     } catch (err) {}
  //   };

  //   getLastMessages();
  // }, [messages]);

  useEffect(() => {
    //   const getLastMessages = async () => {
    //     try {
    //       const response = await axios.get(
    //         `http://localhost:7000/api/messages/getLastMessages`
    //       );

    //       setLastMessages(response.data);
    //     } catch (err) {}
    //   };

    const getUserConversations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/messages/getUserConversations`
        );

        console.log(response.data, "conv");
        setConversations(response.data);
      } catch (err) {}
    };

    getUserConversations();
  }, [loggedUserInfo, messages]);

  return (
    <div className="absolute top-[3.2rem] right-[-3rem] w-[19rem] bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-4 rounded-md z-20 text-black">
      <h2 className="font-bold text-[1.2rem]">Conversations</h2>
      <input
        type="text"
        placeholder="Search Messenger"
        className="w-full rounded-full px-2 py-2 bg-gray-100 focus:outline-none my-4"
      />

      <div>
        {conversations?.map((user, index) => (
          <Conversation
            key={index}
            id={user.id}
            conversationId={user.conversation_id}
            firstName={user.first_name}
            lastName={user.last_name}
            lastMessage={user.last_message}
            image={user.image}
            senderId={user.sender_id}
            seenAt={user.seen_at}
          />
        ))}
      </div>
    </div>
  );
};

export default Messenger;
