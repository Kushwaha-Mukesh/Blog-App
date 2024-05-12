import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Profile from "../components/Profile";
import Posts from "../components/Posts";
import Users from "../components/Users";
import DashboardComments from "../components/DashboardComments";

const dashboard = () => {
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
    <div className="min-h-screen w-full flex flex-col sm:flex-row mt-4">
      <Sidebar />
      {tab === "profile" && <Profile />}
      {tab === "posts" && <Posts />}
      {tab === "users" && <Users />}
      {tab === "comments" && <DashboardComments />}
    </div>
  );
};

export default dashboard;
