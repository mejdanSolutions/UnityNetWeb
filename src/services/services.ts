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
