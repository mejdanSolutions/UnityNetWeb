import axios from "axios";

export const getUserInfo = async (userId: number) => {
  try {
    const response = await axios.get(
      `http://localhost:7000/api/users/getUserInfo/${userId}`
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const getPostCommentsCount = async (postId: number) => {
  try {
    const response = await axios.get(
      `http://localhost:7000/api/posts/getPostCommentsCount/${postId}`
    );

    return response.data;
  } catch (err) {}
};

export const getPostLikesCount = async (postId: number) => {
  try {
    const response = await axios.get(
      `http://localhost:7000/api/posts/getPostCommentsCount/${postId}`
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const getPhotoCommentsCount = async (id: number) => {
  try {
    const response = await axios.get(
      `http://localhost:7000/api/photos/getPhotoCommentsCount/${id}`
    );

    return response.data;
  } catch (err) {}
};
