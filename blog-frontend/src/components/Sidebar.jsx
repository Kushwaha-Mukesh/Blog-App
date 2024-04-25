import { useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../store/userSlice.js";
import { IoCreate } from "react-icons/io5";
import axios from "axios";

const Sidebar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await axios.get("/api/user/signOut");
      if (res.data.success) {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-2 text-lg w-full sm:w-[250px] border-2 rounded-lg">
      <Link
        to={"/dashboard?tab=profile"}
        className={`flex justify-between cursor-pointer mx-4 my-2 hover:border-b-2 ${
          tab === "profile" && "border-b-2 pb-2"
        }`}
      >
        <span className="flex justify-center">
          <FaRegUserCircle className="relative top-[5px] mr-2" />
          Profile
        </span>
        <span className="text-sm bg-gray-500 px-2 rounded-lg">
          {currentUser.newUser.isAdmin ? "admin" : "user"}
        </span>
      </Link>

      {currentUser.newUser.isAdmin && (
        <Link
          to={"/create-post"}
          className={`mx-4 my-2 flex hover:border-b-2 ${
            tab === "create-post" && "border-b-2 pb-2"
          }`}
        >
          <IoCreate className="relative top-1 mr-2" />
          Create a Blog
        </Link>
      )}
      <p
        onClick={handleSignOut}
        className="flex cursor-pointer mx-4 my-2 hover:border-b-2"
      >
        <FaSignOutAlt className="relative top-[5px] mr-2" />
        Sign Out
      </p>
    </div>
  );
};

export default Sidebar;
