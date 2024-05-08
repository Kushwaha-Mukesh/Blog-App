import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { useSelector } from "react-redux";
import { AiFillLike } from "react-icons/ai";
import moment from "moment";

const FetchComment = ({ comment, handleLike }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState({});
  const [commentUserId, setCommentUserId] = useState("");
  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get(`/api/user/getoneuser/${comment.userId}`);
      if (res.data.success) {
        setUser(res.data.user);
        setCommentUserId(res.data.user._id);
      }
    };
    getUser();
  }, [comment]);

  return (
    <div className="flex flex-col mb-8">
      <p className="flex items-center gap-2">
        {user && (
          <>
            <img
              src={user.profilePicture}
              alt="user-profile-image"
              className="w-8 h-8 rounded-full"
            />
            <span>{user.name}</span>
            <span className="text-[12px] ml-1">
              {moment(comment.updatedAt).fromNow()}
            </span>
          </>
        )}
      </p>
      <p className="ml-6 my-1">{comment.content}</p>
      <p className="flex gap-4">
        <span
          onClick={() => handleLike(comment._id)}
          className="flex items-center gap-1 cursor-pointer"
        >
          {currentUser && comment.likes.includes(currentUser.newUser._id) ? (
            <AiFillLike className="text-blue-400" />
          ) : (
            <AiOutlineLike />
          )}{" "}
          {comment.numberOfLikes === 0
            ? "Like"
            : `${comment.numberOfLikes} Likes`}
        </span>
        {currentUser && currentUser.newUser._id === commentUserId && (
          <>
            <span className="cursor-pointer">Edit</span>
            <span className="cursor-pointer">Delete</span>
          </>
        )}
      </p>
    </div>
  );
};

export default FetchComment;
