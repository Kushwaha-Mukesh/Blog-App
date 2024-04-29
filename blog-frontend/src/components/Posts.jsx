import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

const Posts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await axios.get(
          `/api/post/getposts?userId=${currentUser.newUser._id}`
        );
        if (res.data.success) {
          setPosts(res.data.posts);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser.newUser.isAdmin) {
      getPosts();
    }
  }, [currentUser.newUser._id]);
  return (
    <>
      {currentUser.newUser.isAdmin && posts.length > 0 ? (
        <div className="flex-1 mx-4 mt-8 overflow-x-auto">
          <table className="table-fixed text-center min-w-[800px] w-full">
            <thead>
              <tr>
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
                <tr key={post._id} className="">
                  <td>{new Date(post.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/post/${post._id}`}>
                      <img
                        className="w-14 h-14 rounded-lg mx-auto"
                        src={post.image}
                        alt="post-image"
                      />
                    </Link>
                  </td>
                  <td>
                    <Link to={`/post/${post._id}`}>{post.title}</Link>
                  </td>
                  <td>{post.category}</td>
                  <td>
                    <CiEdit className="mx-auto" />
                  </td>
                  <td>
                    <MdDelete className="mx-auto" />
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
    </>
  );
};

export default Posts;
