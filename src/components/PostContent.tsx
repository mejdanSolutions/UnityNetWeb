import React, { useEffect, useState } from "react";
import UserInfo from "./UserInfo";
import CommentsAndLikes from "./CommentsAndLikes";
import axios from "axios";
import Post from "../cards/Post";

interface Props {
  postId: number;
  userId: number;
  firstName: string;
  lastName: string;
  image: string | null;
  postText: string;
  createdAt: Date | number;
  postPhoto: string | null;
  type: string | null;
  setOpenComments: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenLikes: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostContent = ({
  postId,
  userId,
  postText,
  createdAt,
  firstName,
  lastName,
  image,
  postPhoto,
  setOpenComments,
  setOpenLikes,
  type,
}: Props) => {
  const [seeMore, setSeeMore] = useState(false);
  const [sharedPost, setSharedPost] = useState<any>({});

  useEffect(() => {
    if (type === "shared") {
      const getSharedPost = async () => {
        try {
          const response = await axios.get(
            `http://localhost:7000/api/posts/getSharedPost/${postId}`
          );

          setSharedPost(response.data[0]);
        } catch (err) {}
      };

      getSharedPost();
    }
  }, [type, postId]);

  return (
    <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white rounded-md w-full">
      <UserInfo
        userId={userId}
        firstName={firstName}
        lastName={lastName}
        image={image}
        postId={postId}
        createdAt={createdAt}
        type={type}
      />
      <div className="p-3">
        {!seeMore && postText?.length > 120 ? (
          <p>
            {postText.slice(1, 120)}
            <button
              className="block text-blue-600"
              onClick={() => setSeeMore(true)}
            >
              ... SEE MORE
            </button>
          </p>
        ) : (
          <p>{postText}</p>
        )}
      </div>

      {postPhoto && <img className="h-[20rem]" src={postPhoto} alt="" />}

      {type === "shared" && (
        <div className="px-2 pb-5">
          <Post
            postId={sharedPost.id}
            userId={sharedPost.user_id}
            postText={sharedPost.text_content}
            postPhoto={sharedPost.photo}
            firstName={sharedPost.first_name}
            lastName={sharedPost.last_name}
            image={sharedPost.image}
            createdAt={sharedPost.created_at}
            type={sharedPost.likes}
          />
        </div>
      )}

      <div className="p-2 mx-2">
        <CommentsAndLikes
          userId={userId}
          postId={postId}
          setOpenComments={setOpenComments}
          setOpenLikes={setOpenLikes}
        />
      </div>
    </div>
  );
};

export default PostContent;
