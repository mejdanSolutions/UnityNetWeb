import React, { useState, useEffect } from "react";
import { User } from "../types/types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import profileDefault from "../images/profile.jpg";

interface Props {
  id: number;
  setOpenAllFriends: React.Dispatch<React.SetStateAction<boolean>>;
}

const AllFriends = ({ id, setOpenAllFriends }: Props) => {
  const [friends, setFriends] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getFriends = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/users/getUserFriends/${id}`
        );

        setFriends(response.data);
      } catch (err) {}
    };

    getFriends();
  }, [id]);

  return (
    <div className="flex items-center justify-center fixed top-0 bottom-0 left-0 right-0 bg-[rgb(0,0,0,0.5)] z-20">
      <div className=" bg-white w-[19rem] h-[20rem] p-2 rounded-md overflow-y-scroll">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold">Friends</h2>
          <button
            onClick={() => setOpenAllFriends(false)}
            className=" bg-gray-200 rounded-full flex items-center space-x-2 px-3 py-1 font-bold hover:bg-gray-300"
          >
            X
          </button>
        </div>

        <div className="flex flex-col space-y-2">
          {friends.map((user) => (
            <div key={user.id} className="flex flex-col space-y-">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setOpenAllFriends(false);
                      navigate(`/profile/${user.id}`);
                    }}
                  >
                    <img
                      src={user.image || profileDefault}
                      alt=""
                      className="border-2 w-[3rem] h-[3rem] rounded-full"
                    />
                  </button>

                  <h3 className="font-bold">
                    <span>{user.first_name} </span>
                    <span>{user.last_name}</span>
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllFriends;
