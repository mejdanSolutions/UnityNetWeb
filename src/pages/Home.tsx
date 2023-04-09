import React, { useEffect, useState, useRef } from "react";
import CreatePost from "../modals/CreatePost";
import { fetchPosts } from "../redux/postSlice";
import Post from "../cards/Post";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Link } from "react-router-dom";
import profileDefault from "../images/profile.jpg";
import Navbar from "../components/Navbar";
import Chat from "../modals/messenger/Chat";
import SideBar from "../components/SideBar";
import FriendsChat from "../modals/messenger/FriendsChat";
// import { connectToSocket, disconnectFromSocket } from "../redux/socketSlice";
import ChatBubble from "../cards/ChatBubble";

const Home = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.post.posts);
  const chats = useAppSelector((state) => state.chat.chats);
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <section className="relative grid px-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <SideBar />

        {open && <CreatePost setOpen={setOpen} />}
        <main className="my-2 mx-auto max-w-[25rem] md:w-[30rem] md:max-w-[30rem]">
          <div
            onClick={() => setOpen(true)}
            className="flex items-center space-x-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-4 mt-5 rounded-lg w-full"
          >
            <Link to={`/profile/${loggedUserInfo.id}`}>
              <img
                src={loggedUserInfo.image || profileDefault}
                alt=""
                className="rounded-full w-[2.5rem] h-[2rem]"
              />
            </Link>
            <input
              className="bg-gray-100 rounded-full px-3 py-2 w-full"
              placeholder="What is on your mind?"
            />
          </div>
          {posts?.map((post: any) => (
            <Post
              key={post.id}
              postId={post.id}
              postText={post.text_content}
              type={post.type}
              postPhoto={post.photo}
              userId={post.user_id}
              createdAt={post.created_at}
              firstName={post.first_name}
              lastName={post.last_name}
              image={post.image}
            />
          ))}
        </main>
        <FriendsChat />
        {chats.map(
          (chat) => chat.open && <Chat key={chat.userId} chatInfo={chat} />
        )}
        <div className="fixed bottom-0 right-0 w-[3rem] h-[50%]  my-4">
          <div className="absolute bottom-0">
            {chats.map(
              (chat) =>
                chat.open === false && (
                  <ChatBubble
                    key={chat.userId}
                    userId={chat.userId}
                    firstName={chat.firstName}
                    lastName={chat.lastName}
                    image={chat.image}
                    conversationId={chat.conversationId}
                  />
                )
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
