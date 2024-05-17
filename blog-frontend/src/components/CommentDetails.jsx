import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaArrowCircleUp } from "react-icons/fa";
import { FaComments } from "react-icons/fa";

const CommentDetails = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [commentDetails, setCommentDetails] = useState(null);
  useEffect(() => {
    const getCommentDetails = async () => {
      const res = await axios.get("/api/comment/getComments");
      if (res.data.success) {
        setCommentDetails(res.data);
      }
    };

    if (currentUser.newUser.isAdmin) {
      getCommentDetails();
    }
  }, []);
  return (
    <div className="flex flex-col gap-4">
      <div className="border-2 border-slate-800 hover:shadow-lg shadow-sm shadow-blue-500/50 rounded-lg p-2 w-72 mx-6">
        <p className="flex justify-between items-center text-xl">
          Total Comments
          <FaComments />
        </p>
        <span className="text-2xl text-center">
          {commentDetails && commentDetails.totalComments}
        </span>
        <span className="flex items-center gap-2">
          <FaArrowCircleUp className="text-green-400" />
          {commentDetails && commentDetails.lastMonthComments} Last Month
        </span>
      </div>
      <div className="px-6">
        <p className="flex justify-between w-full mb-4 items-center">
          Recent Comments{" "}
          <button className="border-2 rounded-lg px-2 py-1">See all</button>
        </p>
        <div>
          <p className="text-sm flex justify-between w-full mb-4">
            <span>COMMENT CONTENT</span> <span>LIKES</span>
          </p>
          {commentDetails &&
            commentDetails.comments.map((comment) => (
              <p
                className="flex justify-between items-center w-full mb-2"
                key={comment._id}
              >
                <span>{comment.content}</span>
                <span>{comment.numberOfLikes}</span>
              </p>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CommentDetails;
