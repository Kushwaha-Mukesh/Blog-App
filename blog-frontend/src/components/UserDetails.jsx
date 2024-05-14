import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaArrowCircleUp } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";

const UserDetails = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userDetails, setUserDetails] = useState(null);
  useEffect(() => {
    const getUserDetails = async () => {
      const res = await axios.get("/api/user/getusers");
      if (res.data.success) {
        setUserDetails(res.data);
      }
    };

    if (currentUser.newUser.isAdmin) {
      getUserDetails();
    }
  }, []);
  return (
    <div className="flex flex-col gap-10">
      <div className="border-2 border-slate-800 hover:shadow-lg shadow-sm shadow-blue-500/50 rounded-lg p-2">
        <p className="flex justify-between items-center text-xl">
          Total Users
          <FaUsers />
        </p>
        <span className="text-2xl text-center">
          {userDetails && userDetails.totalUsers}
        </span>
        <span className="flex items-center gap-2">
          <FaArrowCircleUp className="text-green-400" />
          {userDetails && userDetails.lastMonthUsers} Last Month
        </span>
      </div>
      <div className="">
        <p className="flex justify-between w-full">
          Recent Users <button>See all</button>
        </p>
        <div>
          <p className="text-sm flex justify-between w-full">
            <span>USER IMAGE</span> <span>USERNAME</span>
          </p>
          {userDetails &&
            userDetails.users.map((user) => (
              <p
                className="flex justify-between items-center w-full"
                key={user._id}
              >
                <img
                  className="w-8 h-8 rounded-full"
                  src={user.profilePicture}
                  alt="user-image"
                />
                <span>{user.name}</span>
              </p>
            ))}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
