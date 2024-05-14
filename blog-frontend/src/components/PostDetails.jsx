import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaArrowCircleUp } from "react-icons/fa";
import { TbArticle } from "react-icons/tb";

const PostDetails = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [postDetails, setPostDetails] = useState(null);
  useEffect(() => {
    const getPostDetails = async () => {
      const res = await axios.get("/api/post/getPosts");
      if (res.data.success) {
        setPostDetails(res.data);
      }
    };

    if (currentUser.newUser.isAdmin) {
      getPostDetails();
    }
  }, []);
  return (
    <div className="flex flex-col gap-10">
      <div className="border-2 border-slate-800 hover:shadow-lg shadow-sm shadow-blue-500/50 rounded-lg p-2">
        <p className="flex justify-between items-center text-xl">
          Total Posts
          <TbArticle />
        </p>
        <span className="text-2xl text-center">
          {postDetails && postDetails.totalPosts}
        </span>
        <span className="flex items-center gap-2">
          <FaArrowCircleUp className="text-green-400" />
          {postDetails && postDetails.lastMonthPosts} Last Month
        </span>
      </div>
      <div className="">
        <p className="flex justify-between w-full">
          Recent Posts <button>See all</button>
        </p>
        <div>
          <p className="text-sm flex justify-between w-full">
            <span>POST IMAGE</span> <span>POST</span> <span>CATEGORY</span>
          </p>
          {postDetails &&
            postDetails.posts.map((post) => (
              <p
                className="flex justify-between items-center w-full"
                key={post._id}
              >
                <img
                  className="w-8 h-8 rounded-lg"
                  src={post.image}
                  alt="post-image"
                />
                <span>{post.title}</span>
                <span>{post.category}</span>
              </p>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
