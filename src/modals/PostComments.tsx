import React from "react";
import CommentsContent from "../components/CommentsContent";

import PostContent from "../components/PostContent";

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
  // getCommAndLikesCount: () => void;
}

const PostComments = ({
  postId,
  userId,
  firstName,
  lastName,
  image,
  postText,
  createdAt,
  postPhoto,
  type,
  setOpenComments,
  setOpenLikes,
}: Props) => {
  return (
    <div className="fixed flex justify-center items-center top-0 bottom-0 left-0 right-0 bg-[rgb(0,0,0,0.5)] z-20">
      <div className="flex justify-center flex-col space-y-2 bg-white mx-2 h-max px-5 rounded-lg overflow-y-auto lg:w-[40rem] max-h-[50rem]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenComments(false);
          }}
          className="bg-gray-200 rounded-full flex items-center space-x-2 px-3 py-1 w-[2rem] hover:bg-gray-300 my-2"
        >
          X
        </button>

        <PostContent
          postId={postId}
          userId={userId}
          firstName={firstName}
          lastName={lastName}
          image={image}
          postPhoto={postPhoto}
          postText={postText}
          createdAt={createdAt}
          setOpenLikes={setOpenLikes}
          setOpenComments={setOpenComments}
          type={type}
        />

        <CommentsContent userId={userId} postId={postId} image={image} />
      </div>
    </div>
  );
};

export default PostComments;
