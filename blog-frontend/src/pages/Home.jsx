import axios from "axios";
import { useEffect, useState } from "react";
import { ImSpinner10 } from "react-icons/im";
import { useParams, Link } from "react-router-dom";
import PostCard from "../components/PostCard";
const Home = () => {
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState([]);
  useEffect(() => {
    try {
      const getPost = async () => {
        setLoading(true);
        const res = await axios.get("/api/post/getposts");
        if (res.data.success) {
          setLoading(false);
          setPost(res.data.posts);
        }
        setLoading(false);
      };

      getPost();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <p className="text-2xl flex items-center gap-2">
          <ImSpinner10 className="animate-spin" />
          Loading...
        </p>
      </div>
    );

  return (
    <main className="flex flex-col items-center justify-center w-3/4 lg:w-1/2 mx-auto mt-8">
      <div className="w-full">
        <h1 className="text-2xl text-center mb-10">Articles</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 place-content-between gap-x-4 gap-y-12 mb-20">
          {post.length > 0 &&
            post.map((p) => <PostCard key={p._id} post={p} />)}
        </div>
      </div>
    </main>
  );
};

export default Home;
