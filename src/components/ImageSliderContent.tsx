import React, { useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { IPhoto } from "../types/types";
import UserInfo from "./UserInfo";
import UsersByLikes from "../modals/UsersByLikes";
import CommentsAndLikes from "./CommentsAndLikes";
import CommentsContent from "./CommentsContent";

interface Props {
  photos: any[];
  userId: number;
}

const ImageSliderContent = ({ userId, photos }: Props) => {
  const [openLikes, setOpenLikes] = useState(false);
  const [count, setCount] = useState(0);
  const [openComments, setOpenComments] = useState(true);

  return (
    <div className="relative w-full mt-20">
      <div className="bg-white text-black">
        <div
          id="slider"
          className="relative h-[30rem] bg-black flex items-center"
        >
          <img
            src={photos[count]?.photo}
            alt=""
            className="h-[25rem] w-full border-b-2"
          />

          {count !== 0 && (
            <div
              id="left"
              className="hidden absolute bg-[rgb(0,0,0,0.3)] h-full w-[5rem] hover:translate-x-[-0.5rem] transition ease-out"
            >
              <button
                className="bg-white text-black w-[3rem] h-[3rem] flex items-center justify-center rounded-full hover:bg-gray-200"
                onClick={() => setCount((prev) => (count > 0 ? prev - 1 : 0))}
              >
                <AiOutlineLeft className="" />
              </button>
            </div>
          )}

          {count !== photos.length - 1 && (
            <div
              id="right"
              className="hidden absolute right-0 bg-[rgb(0,0,0,0.3)] h-full w-[5rem] hover:translate-x-[0.5rem] transition ease-out"
            >
              <button
                className="bg-white text-black w-[3rem] h-[3rem] flex items-center justify-center rounded-full hover:bg-gray-200"
                onClick={() =>
                  setCount((prev) =>
                    count < photos.length - 1 ? prev + 1 : photos.length - 1
                  )
                }
              >
                <AiOutlineRight />
              </button>
            </div>
          )}
        </div>
        <UserInfo
          userId={userId}
          firstName={photos[count]?.first_name}
          lastName={photos[count]?.last_name}
          image={photos[count]?.image}
          postId={photos[count]?.id}
          createdAt={photos[count]?.created_at}
          type={photos[count]?.type}
        />

        <p className="px-4 py-2">{photos[count]?.description}</p>

        <div className="px-4">
          <CommentsAndLikes
            userId={userId}
            postId={photos[count]?.id}
            setOpenComments={setOpenComments}
            setOpenLikes={setOpenLikes}
          />
        </div>
      </div>

      {openComments && (
        <div className="p-3 overflow-y-auto">
          {
            <CommentsContent
              userId={userId}
              postId={photos[count]?.id}
              image={photos[count]?.image}
            />
          }
        </div>
      )}

      {openLikes && (
        <UsersByLikes postId={photos[count]?.id} setOpenLikes={setOpenLikes} />
      )}
    </div>
  );
};

export default ImageSliderContent;
