import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { useSelector } from "react-redux";
import { AiFillLike } from "react-icons/ai";
import moment from "moment";

const FetchComment = ({ comment, handleLike, handleEditComment, onDelete }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState({});
  const [commentUserId, setCommentUserId] = useState("");
  const [editComment, setEditComment] = useState(false);
  const [commentValue, setCommentValue] = useState(comment.content);
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

  const handleSaveClick = (id, commentContent) => {
    setEditComment(false);
    handleEditComment(id, commentContent);
  };

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
              {moment(comment.createdAt).fromNow()}
            </span>
          </>
        )}
      </p>
      {editComment ? (
        <>
          <textarea
            className="bg-transparent border-2 rounded-lg px-2 py-2 my-4"
            rows={3}
            cols={3}
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
          ></textarea>
          <p className="flex justify-end gap-2 mb-2">
            <button
              onClick={() => handleSaveClick(comment._id, commentValue)}
              className="border-2 rounded-lg px-2 py-1 bg-teal-800"
            >
              Save
            </button>
            <button
              onClick={() => setEditComment(false)}
              className="border-2 rounded-lg px-2 py-1 bg-red-800"
            >
              Cancel
            </button>
          </p>
        </>
      ) : (
        <>
          <p className="ml-6 my-1">{comment.content}</p>
          <p className="flex gap-4">
            <span
              onClick={() => handleLike(comment._id)}
              className="flex items-center gap-1 cursor-pointer"
            >
              {currentUser &&
              comment.likes.includes(currentUser.newUser._id) ? (
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
                <span
                  onClick={() => setEditComment(true)}
                  className="cursor-pointer hover:text-blue-700"
                >
                  Edit
                </span>
                <span
                  onClick={() => onDelete(comment._id)}
                  className="cursor-pointer hover:text-red-600"
                >
                  Delete
                </span>
              </>
            )}
          </p>
        </>
      )}
    </div>
  );
};

export default FetchComment;
