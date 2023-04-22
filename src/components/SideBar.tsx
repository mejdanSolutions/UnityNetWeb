import React from "react";
import { useAppSelector } from "../redux/hooks";
import { FaUserFriends } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const navigate = useNavigate();

  return (
    <div className="hidden lg:block w-[20rem] mt-5 font-bold bg-white rounded-md p-2 sticky top-[6rem] h-max shadow-[0_3px_10px_rgb(0,0,0,0.2)] ">
      <span className="text-2xl p-2">Profile</span>

      <div className="mt-5">
        <div className="flex items-center justify-between hover:bg-gray-100 hover:cursor-pointer rounded-md p-2 mt-2">
          <div
            onClick={() => navigate(`/profile/${loggedUserInfo.id}`)}
            className="flex items-center justify-center space-x-2"
          >
            <img
              src={""}
              alt=""
              className="rounded-full border-2 w-[2.5rem] h-[2.2rem]"
            />
            <span className="font-bold">{loggedUserInfo.first_name}</span>
            <span className="font-bold">{loggedUserInfo.last_name}</span>
          </div>
        </div>

        <div className="flex items-center justify-between hover:bg-gray-100 hover:cursor-pointer rounded-md p-2 mt-2">
          <div className="flex items-center justify-center space-x-2">
            <FaUserFriends size={30} className="text-blue-500" />

            <span className="font-bold">View</span>
            <span className="font-bold">Friends</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
