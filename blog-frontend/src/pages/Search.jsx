import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PostCard from "../components/PostCard";

const Search = () => {
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState([]);
  const location = useLocation();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get("searchTerm");
    const getPosts = async () => {
      const res = await axios.get(
        `/api/post/getposts?searchTerm=${searchTerm}`
      );
      if (res.data.success) {
        setPost(res.data.posts);
      }
    };
    if (searchTerm) {
      getPosts();
    }
  }, [location.search]);

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
        <h1 className="text-2xl text-center mb-10">Search Results</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 place-content-between gap-x-4 gap-y-12 mb-20">
          {post.length > 0 &&
            post.map((p) => <PostCard key={p._id} post={p} />)}
        </div>
      </div>
    </main>
  );
};

export default Search;
