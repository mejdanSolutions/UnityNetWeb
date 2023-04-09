import React from "react";
import { AiFillHome } from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";

const ProfileInfo = () => {
  return (
    <div className="p-3 flex flex-col space-y-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white mx-2 rounded-md min-w-[10rem] max-w-[30rem]">
      <span className="flex items-center space-x-2">
        <AiFillHome size={20} />
        <div>
          <span>Lives in </span>
          <span className="font-bold">Tuzla</span>
        </div>
      </span>

      <span className="flex items-center space-x-2">
        <MdLocationPin size={20} />
        <div>
          <span>From </span>
          <span className="font-bold">Tuzla</span>
        </div>
      </span>

      <span className="flex items-center space-x-2">
        <button>
          <BsThreeDots size={20} />
        </button>

        <span>see first_name's About info</span>
      </span>
    </div>
  );
};

export default ProfileInfo;
