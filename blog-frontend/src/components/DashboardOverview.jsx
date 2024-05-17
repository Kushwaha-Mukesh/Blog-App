import CommentDetails from "./CommentDetails";
import PostDetails from "./PostDetails";
import UserDetails from "./UserDetails";

const DashboardOverview = () => {
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-10 w-full pb-12 pt-10 sm:pt-0">
      <UserDetails />
      <CommentDetails />
      <PostDetails />
    </div>
  );
};

export default DashboardOverview;
