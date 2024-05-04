import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { IoInformationCircleOutline } from "react-icons/io5";

const Posts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postId, setPostId] = useState("");
  const [postTitle, setPostTitle] = useState("");
  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await axios.get(
          `/api/post/getposts?userId=${currentUser.newUser._id}`
        );
        if (res.data.success) {
          setPosts(res.data.posts);
          if (res.data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser.newUser.isAdmin) {
      getPosts();
    }
  }, [currentUser.newUser._id]);

  const handleShowMore = async () => {
    const startIndex = posts.length;
    try {
      const res = await axios.get(
        `/api/post/getposts?userId=${currentUser.newUser._id}&&startIdx=${startIndex}`
      );
      if (res.data.success) {
        setPosts((prev) => [...prev, ...res.data.posts]);
        if (res.data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteClick = (id, title) => {
    setPostId(id);
    setPostTitle(title);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await axios.delete(`/api/post/deletepost/${postId}`);
      if (res.data.success) {
        setPosts((prev) => prev.filter((post) => post._id !== postId));
      }
      setShowModal(false);
    } catch (error) {
      setShowModal(false);
      console.log(error.response.data.message);
    }
  };
  return (
    <>
      {currentUser.newUser.isAdmin && posts.length > 0 ? (
        <div className="flex-1 mx-4 mt-8 overflow-x-auto">
          <table className="table-auto text-center min-w-[800px] w-full">
            <thead>
              <tr className="border-b-8 border-transparent">
                <th>Date Updated</th>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id} className="border-b-8 border-transparent">
                  <td>{new Date(post.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        className="w-14 h-14 rounded-lg mx-auto"
                        src={post.image}
                        alt="post-image"
                      />
                    </Link>
                  </td>
                  <td>
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                  </td>
                  <td>{post.category}</td>
                  <td>
                    <Link to={`/update-post/${post._id}`}>
                      <CiEdit className="mx-auto hover:cursor-pointer hover:text-blue-700" />
                    </Link>
                  </td>
                  <td>
                    <MdDelete
                      onClick={() => handleDeleteClick(post._id, post.title)}
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
          There are no posts available for you.
        </div>
      )}

      {posts.length > 0 && showMore && (
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
          <p className="text-lg mb-6">
            Are you sure want to delete "{postTitle}" post ?
          </p>
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

export default Posts;
