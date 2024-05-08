import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import FetchComment from "./FetchComment";
import { Link, useNavigate } from "react-router-dom";

const Comment = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const commentRef = useRef();
  const submitComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/comment/create", {
        content: commentRef.current.value,
        postId,
      });
      if (res.data.success) {
        commentRef.current.value = "";
        setComments((prevComments) => [res.data.comment, ...prevComments]);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await axios.get(
          `/api/comment/getComment/${postId && postId}`
        );
        setComments(res.data.comments);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (id) => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }
    try {
      const res = await axios.get(`/api/comment/likeComment/${id}`);
      if (res.data.success) {
        setComments(
          comments.map((comment) =>
            comment._id === id
              ? {
                  ...comment,
                  likes: res.data.comment.likes,
                  numberOfLikes: res.data.comment.numberOfLikes,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <span className="mt-14 text-sm self-start mb-2 text-blue-400">
        {currentUser ? (
          `signed in as: ${currentUser.newUser.name}`
        ) : (
          <>
            <Link to={"/sign-in"} className="underline font-semibold">
              Sign In
            </Link>{" "}
            to comment
          </>
        )}
      </span>
      <form onSubmit={submitComment} className="w-full flex flex-col">
        <textarea
          name="comment"
          id="comment"
          ref={commentRef}
          rows={3}
          cols={3}
          placeholder="write your comment"
          className="w-full outline-none border-2 bg-transparent py-2 px-2 rounded-lg"
        ></textarea>
        <button type="submit" className="border-2 p-2 rounded-lg mt-4">
          Comment
        </button>
      </form>
      <h2 className="mt-10 text-2xl w-fit self-start">
        Comments{" "}
        <span className="text-lg ml-2 border-2 px-2 py-1 rounded-lg">
          {comments.length}
        </span>
      </h2>

      <div className="self-start mb-14 mt-6">
        {comments.length > 0 &&
          comments.map((comment) => (
            <FetchComment
              key={comment._id}
              comment={comment}
              handleLike={handleLike}
            />
          ))}
      </div>
    </>
  );
};

export default Comment;
