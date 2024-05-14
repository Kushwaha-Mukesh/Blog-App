import CommentDetails from "./CommentDetails";
import PostDetails from "./PostDetails";
import UserDetails from "./UserDetails";

const DashboardOverview = () => {
  return (
    <div className="grid grid-cols-2 gap-10">
      <UserDetails />
      <CommentDetails />
      <PostDetails />
    </div>
  );
};

export default DashboardOverview;
