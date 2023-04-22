import React, { useCallback, useEffect, useState } from "react";
import { IoLogoHackernews } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { FaUserFriends } from "react-icons/fa";
import FriendRequests from "../modals/FriendRequests";
import Profile from "../modals/Profile";
import { useAppSelector } from "../redux/hooks";
import profileDefault from "../images/profile.jpg";
import { BsMessenger } from "react-icons/bs";
import { IoIosNotifications } from "react-icons/io";
import Notifications from "../modals/Notifications";
import Messenger from "../modals/messenger/Messenger";
import axios from "axios";
import { User } from "../types/types";
import { AiOutlineSearch } from "react-icons/ai";

function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return function debounced(...args: Parameters<T>) {
    const later = () => {
      timeoutId = null;
      func(...args);
    };
    clearTimeout(timeoutId!);
    timeoutId = setTimeout(later, wait) as ReturnType<typeof setTimeout>;
  };
}

const Navbar = () => {
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const [reqOpen, setReqOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [messagesOpen, setOpenMessages] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const requestsCount = useAppSelector((state) => state.request.requestCount);
  const notificationsCount = useAppSelector(
    (state) => state.notification.notifications
  ).length;
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:7000/api/users/searchUsers?q=${encodeURIComponent(
          query
        )}`
      );

      setSearchResults(response.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const debouncedSearch = useCallback(debounce(handleSearch, 500), []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);
    if (query.length >= 2) {
      debouncedSearch(query);
    } else {
      setSearchSuggestions([]);
    }
  };

  useEffect(() => {
    window.addEventListener("click", () => {
      setSearchOpen(false);
    });
  });

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/users/searchUsers?q=${encodeURIComponent(
            searchTerm
          )}`
        );
        setSearchSuggestions(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (searchTerm.length >= 2) {
      fetchSuggestions();
    } else if (searchTerm.length >= 1) {
      setSearchOpen(true);
    } else {
      setSearchSuggestions([]);
      setSearchOpen(false);
    }
  }, [searchTerm]);

  return (
    <div className="flex items-center justify-between border bg-white text-white p-3 sticky top-0 z-20">
      <div className="relative flex items-center space-x-2">
        <Link className="text-2xl text-blue-500 font-bold" to="/home">
          UN
        </Link>

        <input
          onClick={(e) => {
            e.stopPropagation();
            setSearchOpen(true);
          }}
          value={searchTerm}
          onChange={handleInputChange}
          type="text"
          className="w-[10rem] bg-gray-100 rounded-full focus:outline-none text-black px-2 py-[0.5rem] md:w-[15rem]"
          placeholder="search social media"
        />

        {(searchSuggestions.length > 0 || searchOpen) && (
          <div className="absolute top-[3.2rem] left-5 w-[15rem] h-[15rem] rounded-md p-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-30 bg-white text-black">
            <div className="flex items-center space-x-2 hover:bg-gray-100 hover:cursor-pointer p-2 rounded-md">
              <span className="rounded-full bg-blue-500 text-white w-[2rem] h-[2rem] flex items-center justify-center">
                <AiOutlineSearch size={20} />
              </span>
              <span className="text-blue-500">Search {searchTerm}</span>
            </div>

            {searchSuggestions.map((suggestion) => (
              <div
                onClick={() => navigate(`/profile/${suggestion.id}`)}
                key={suggestion.id}
                className="flex items-center space-x-4 hover:bg-gray-100 p-1 rounded-md hover:cursor-pointer mt-2"
              >
                <img
                  src={suggestion.image || profileDefault}
                  alt=""
                  className="w-[2.5rem] h-[2.5rem] rounded-full"
                />

                <div className="flex space-x-1 font-bold">
                  <span>{suggestion.first_name}</span>
                  <span>{suggestion.last_name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative flex items-center space-x-2">
        <div className="relative">
          <button
            className="bg-gray-200 w-[2.5rem] h-[2.5rem] flex items-center justify-center rounded-full hover:bg-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              setOpenNotification((prev) => !prev);
            }}
          >
            <IoIosNotifications size={25} className="text-blue-500" />
          </button>

          {notificationsCount !== 0 && (
            <span className="flex items-center justify-center absolute top-[-0.4rem] right-[-0.5rem] text-[0.8rem] w-[1rem] h-[1rem] bg-red-600 rounded-full">
              {notificationsCount}
            </span>
          )}

          {openNotification && <Notifications />}
        </div>

        <div className="relative">
          <button
            className="bg-gray-200 w-[2.5rem] h-[2.5rem] flex items-center justify-center rounded-full hover:bg-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              setReqOpen((prev) => !prev);
            }}
          >
            <FaUserFriends size={22} className="text-blue-500" />
          </button>

          {requestsCount !== 0 && (
            <span className="flex items-center justify-center absolute top-[-0.4rem] right-[-0.5rem] text-[0.8rem] w-[1rem] h-[1rem] bg-red-600 rounded-full">
              {requestsCount}
            </span>
          )}

          {reqOpen && <FriendRequests setReqOpen={setReqOpen} />}
        </div>

        <div className="relative">
          <button
            className="bg-gray-200 w-[2.5rem] h-[2.5rem] flex items-center justify-center rounded-full hover:bg-gray-300"
            onClick={() => setOpenMessages((prev) => !prev)}
          >
            <BsMessenger size={19} className="text-blue-500" />
          </button>

          {messagesOpen && <Messenger setOpenMessages={setOpenMessages} />}
        </div>

        <div className="relative">
          <img
            onClick={(e) => {
              e.stopPropagation();
              setProfileOpen((prev) => !prev);
            }}
            src={loggedUserInfo.image || profileDefault}
            alt=""
            className="w-[2.5rem] h-[2.5rem] border-2 rounded-[100%] hover:cursor-pointer"
          />

          {profileOpen && <Profile setProfileOpen={setProfileOpen} />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
