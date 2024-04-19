import { useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="flex flex-col gap-2 text-lg w-full sm:w-[220px] border-2 rounded-lg">
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
        <span className="text-sm bg-gray-500 px-2 rounded-lg">user</span>
      </Link>
      <p className="flex cursor-pointer mx-4 my-2 hover:border-b-2">
        <FaSignOutAlt className="relative top-[5px] mr-2" />
        Sign Out
      </p>
    </div>
  );
};

export default Sidebar;
