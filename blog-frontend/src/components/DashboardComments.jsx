import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { IoInformationCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const DashboardComments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentId, setCommentId] = useState("");
  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await axios.get("/api/comment/getComments");
        if (res.data.success) {
          setComments(res.data.comments);
          setPosts(res.data.posts);
          setUsers(res.data.users);
          if (res.data.comments.length < 10) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser.newUser.isAdmin) {
      getComments();
    }
  }, [currentUser.newUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await axios.get(
        `/api/comment/getComments?startIdx=${startIndex}`
      );
      if (res.data.success) {
        setComments((prev) => [...prev, ...res.data.comments]);
        if (res.data.comments.length < 10) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteClick = (id) => {
    setCommentId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await axios.delete(`/api/comment/deleteComment/${commentId}`);
      if (res.data.success) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentId)
        );
      }
      setShowModal(false);
    } catch (error) {
      setShowModal(false);
      console.log(error.response.data.message);
    }
  };
  return (
    <>
      {currentUser.newUser.isAdmin && comments.length > 0 ? (
        <div className="flex-1 mx-4 mt-8 overflow-x-auto">
          <table className="table-auto text-center min-w-[900px] w-full">
            <thead>
              <tr className="border-b-8 border-transparent">
                <th>Date Created</th>
                <th>Likes</th>
                <th>Comments</th>
                <th>Posts</th>
                <th>Users</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment, i) => (
                <tr
                  key={comment._id}
                  className="border-b-[12px] border-transparent"
                >
                  <td>{new Date(comment.createdAt).toLocaleDateString()}</td>
                  <td>{comment.numberOfLikes}</td>
                  <td>{comment.content}</td>
                  <td className="whitespace-nowrap overflow-hidden text-ellipsis">
                    <Link to={`/post/${posts[i].slug}`}>{posts[i].title}</Link>
                  </td>
                  <td>
                    <p className="flex items-center gap-2">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={users[i].image}
                        alt="user-image"
                      />
                      <span>{users[i].name}</span>
                    </p>
                  </td>
                  <td>
                    <MdDelete
                      onClick={() => handleDeleteClick(comment._id)}
                      className="mx-auto hover:cursor-pointer hover:text-red-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-1 justify-center items-center text-lg">
          There are no comments yet!
        </div>
      )}

      {comments.length > 0 && showMore && (
        <button
          onClick={handleShowMore}
          className="text-sm w-full text-center text-teal-500"
        >
          Show More
        </button>
      )}

      {showModal && (
        <div className="absolute top-1/2 left-1/2 rounded-lg py-4 px-8 text-center flex flex-col gap-2 bg-gray-800 text-white">
          <IoInformationCircleOutline className="self-center text-3xl" />
          <p className="text-lg mb-6">Are you sure want to delete comment?</p>
          <p className="flex justify-around">
            <button
              onClick={handleConfirmDelete}
              className="bg-red-500 px-2 rounded-lg text-white text-lg"
            >
              Yes
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-600 text-white px-2 rounded-lg text-lg"
            >
              Cancel
            </button>
          </p>
        </div>
      )}
    </>
  );
};

export default DashboardComments;
