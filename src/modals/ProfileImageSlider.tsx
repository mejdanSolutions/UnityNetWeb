import axios from "axios";
import React, { useEffect, useState } from "react";
import { IPhoto } from "../types/types";
import ImageSliderContent from "../components/ImageSliderContent";

interface Props {
  userId: number;
  setProfileImageOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileImageSlider = ({ userId, setProfileImageOpen }: Props) => {
  const [photos, setPhotos] = useState<any[]>([]);

  useEffect(() => {
    const getPhotos = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/users/getUserProfilePhotos/${userId}`
        );

        setPhotos(response.data);
      } catch (err) {}
    };

    getPhotos();
  }, [userId]);

  return (
    <div className="flex flex-col fixed top-0 bottom-0 left-0 right-0 bg-white z-30 overflow-y-auto">
      <button
        onClick={() => setProfileImageOpen(false)}
        className="absolute top-2 left-2 bg-gray-300 rounded-full w-[2rem] h-[2rem] hover:bg-gray-200"
      >
        X
      </button>

      <ImageSliderContent photos={photos} userId={userId} />
    </div>
  );
};

export default ProfileImageSlider;
