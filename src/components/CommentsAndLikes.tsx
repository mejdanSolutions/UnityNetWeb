import React, { useEffect, useState } from "react";
import { Count } from "../types/types";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import axios from "axios";
import { getPostCommentsCount } from "../services/services";
import { postActions } from "../redux/postSlice";
import { AiFillHeart } from "react-icons/ai";
import { VscComment } from "react-icons/vsc";
import { BsShare } from "react-icons/bs";
import SharePost from "../modals/SharePost";
import { sendNotification } from "../redux/notificationSlice";
import { createNotification } from "../redux/notificationSlice";

interface Props {
  userId: number;
  postId: number;
  setOpenLikes: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenComments: React.Dispatch<React.SetStateAction<boolean>>;
}

const CommentsAndLikes = ({
  postId,
  setOpenLikes,
  setOpenComments,
  userId,
}: Props) => {
  const [openSharePost, setOpenSharePost] = useState(false);
  const [liked, setLiked] = useState(false);
  const dispatch = useAppDispatch();
  const postCommentDeleted = useAppSelector(
    (state) => state.post.postCommentDeleted
  );
  const [count, setCount] = useState<Count>({
    comments: 0,
    likes: 0,
  });
  const [shared, setShared] = useState(false);
  const postCommented = useAppSelector((state) => state.post.postCommented);
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);

  useEffect(() => {
    const isPostShared = async () => {
      const response = await axios.get(
        `http://localhost:7000/api/posts/isPostShared/${postId}`
      );

      setShared(response.data);
    };

    isPostShared();
  }, [postId]);

  useEffect(() => {
    const isLiked = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/posts/isPostLiked/${postId}`
        );
        setLiked(response.data);
      } catch (err) {}
    };

    isLiked();
  }, [postId]);

  const likePostHandler = async () => {
    try {
      await axios.get(`http://localhost:7000/api/posts/likePost/${postId}`);

      if (!liked && loggedUserInfo.id !== userId) {
        dispatch(
          sendNotification({
            id: loggedUserInfo.id,
            first_name: loggedUserInfo.first_name,
            last_name: loggedUserInfo.last_name,
            image: loggedUserInfo.image,
            type: "like",
            created_at: new Date(),
            receiver_id: userId,
            post_id: postId,
          })
        );
        dispatch(
          createNotification({
            receiverId: userId,
            type: "like",
            postId: postId,
          })
        );
      }

      setLiked((prev) => !prev);
    } catch (err) {}
  };

  useEffect(() => {
    const getCommAndLikesCount = async () => {
      let data = await getPostCommentsCount(postId);
      dispatch(postActions.setPostCommentDeleted(false));
      dispatch(postActions.setPostCommented(false));
      setCount(data);
    };
    getCommAndLikesCount();
  }, [liked, postCommentDeleted, postCommented]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex items-center space-x-2 mt-2">
      <button onClick={likePostHandler}>
        {" "}
        <AiFillHeart
          size={25}
          style={liked ? { color: "red" } : { color: "black" }}
        />
      </button>
      <button
        onClick={() => setOpenLikes(true)}
        className="flex space-x-1 hover:text-blue-500"
      >
        <span>{count.likes}</span>
        <span>{count.likes > 1 ? "Likes" : "Like"}</span>
      </button>

      <VscComment size={25} />

      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpenComments((prev) => !prev);
        }}
        className="flex space-x-1 hover:text-blue-500"
      >
        <span>{count.comments}</span>
        <span>Comments</span>
      </button>

      <div className="flex items-center space-x-2">
        <button onClick={() => setOpenSharePost(true)} className="space-x-2">
          <BsShare />
        </button>

        <button className="flex space-x-1 hover:text-blue-500">
          <span>0</span>
          <span>Shares</span>
        </button>
      </div>

      {openSharePost && (
        <SharePost postId={postId} setOpenSharePost={setOpenSharePost} />
      )}
    </div>
  );
};

export default CommentsAndLikes;
