import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ADD_PROFILE_IMAGE, REMOVE_PROFILE_IMAGE, UPDATE_PROFILE } from "@/utils/constants";
import apiClient from "@/lib/api-client";
import { HOST } from "@/utils/constants";


const Profile = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(""); 
  const [lastName, setLastName] = useState("");
  const [profileImage, setProfileImage] = useState(null); 
  const [hover, setHover] = useState(false); 
  const [selectedColor, setSelectedColor] = useState(0); 

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName); 
      setLastName(userInfo.lastName); 
      setSelectedColor(userInfo.color);
    }
    if (userInfo.profileImage) {
      setProfileImage(`${HOST}/${userInfo.profileImage}`);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First name is required");
      return false; 
    } 
    if (!lastName) {
      toast.error("Last name is required");
      return false; 
    }
    return true; 
  }

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const res = await apiClient.post(
          UPDATE_PROFILE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );
        if (res.status === 200 && res.data.user) {
          setUserInfo(res.data.user)
          toast.success("Profile updated!");
          navigate("/chat");
        }
      } catch (err) {
        console.log(err); 
      }
    }
  }

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please finish setting up profile."); 
    }
  };

  const handleInputClick = () => {
    inputRef.current.click();
  };

  const handleChangeImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("profile-image", file);
        
        const res = await apiClient.post(
          ADD_PROFILE_IMAGE, formData,
          { withCredentials: true }
        )
        if (res.status === 200 && res.data.profileImage) {
          setUserInfo({ ...userInfo, profileImage: res.data.profileImage }); 
          toast.success("Image updated successfully!"); 
        }
      } catch (err) {
        console.log(err); 
      }
    }
  }

  const handleDeleteImage = async () => {
    try {
      const res = await apiClient.delete(
        REMOVE_PROFILE_IMAGE,
        { withCredentials: true }
      )
      if (res.status === 200) {
        setUserInfo({ ...userInfo, profileImage: null });
        toast.success("Image deleted successfully!"); 
        setProfileImage(null); 
      }
    } catch (err) {
      console.log(err); 
    }
  }

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={ handleNavigate }>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        <div className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        >
          <Avatar className="h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden">
            {
              profileImage ? (
                <AvatarImage 
                  src={profileImage} 
                  alt="profile" 
                  className="object-cover w-full h-full bg-black" 
                />
              ) : (
                <div className={`uppercase h-32 w-32 md:h-48 md:w-48 text-5xl border-[1px] flex items-center justify-center rounded-full text-white ${getColor(selectedColor)}`}>
                  {firstName
                    ? firstName.split("")[0]
                    : userInfo.email.split("")[0]}
                </div>
              )
            }
          </Avatar>
          {
            hover && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full"
              onClick={ profileImage ? handleDeleteImage : handleInputClick }>
                {
                  profileImage ? <FaTrash  className="text-white text-3xl cursor-pointer"/> : <FaPlus className="text-white text-3xl cursor-pointer" />
                }
              </div>
            )
          }
          <input 
            type="file" 
            ref={ inputRef } 
            className="hidden" 
            onChange={ handleChangeImage } 
            name="profile-image" 
            accept=".png, .jpg, .jpeg, .svg, .webp" 
          />
        </div>
        <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
          <div className="w-full">
            <Input 
              placeholder="Email" 
              type="email" 
              disabled 
              value={userInfo.email} 
              className="rounded-lg p-6 bg-[2c2e3b] border-none" 
            />
          </div>
          <div className="w-full">
            <Input 
              placeholder="First Name" 
              type="text" 
              onChange={e => setFirstName(e.target.value)}
              value={firstName} 
              className="rounded-lg p-6 bg-[#2c2e3b] border-none" 
            />
          </div>
          <div className="w-full">
            <Input 
              placeholder="Last Name" 
              type="text" 
              onChange={e => setLastName(e.target.value)}
              value={lastName} 
              className="rounded-lg p-6 bg-[#2c2e3b] border-none" 
            />
          </div>
          <div className="w-full flex gap-5">
            {colors.map((color, index) => (
              <div 
                className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300
                ${selectedColor === index
                  ? "outline outline-white outline-1"
                  : ""
                }`}
                key={index}
                onClick={() => setSelectedColor(index)}
                >
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full">
        <Button 
          className="h-16 w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 mx-auto bg-gradient-to-r from-[#4e54c8] to-[#8f94fb] hover:from[#8f94fb] hover:to-[#4e54c8] transition-all duration-300"
          onClick={ saveChanges }
          >
            Save Changes
        </Button>
      </div>
    </div>
  )
}

export default Profile;