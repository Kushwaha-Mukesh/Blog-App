import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ImSpinner10 } from "react-icons/im";
import Comment from "../components/Comment";
import PostCard from "../components/PostCard";

const PostPage = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState();
  const [recentPosts, setRecentPosts] = useState([]);
  useEffect(() => {
    try {
      const getPost = async () => {
        setLoading(true);
        const res = await axios.get(`/api/post/getPosts?slug=${postSlug}`);
        if (res.data.success) {
          setLoading(false);
          setPost(res.data.posts[0]);
        }
        setLoading(false);
      };

      getPost();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, [postSlug]);

  useEffect(() => {
    try {
      const getRecentPost = async () => {
        setLoading(true);
        const res = await axios.get("/api/post/getPosts?limit=3");
        if (res.data.success) {
          setLoading(false);
          setRecentPosts(res.data.posts);
        }
        setLoading(false);
      };

      getRecentPost();
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
    <main className="flex flex-col items-center justify-center w-3/4 lg:w-1/2 mx-auto">
      <h1 className="text-xl sm:text-3xl mt-8 w-fit mx-auto">
        {post && post.title}
      </h1>
      <Link
        className="text-sm my-8 border-2 rounded-lg px-2 py-1"
        to={`/search?category=${post && post.category}`}
      >
        {post && post.category}
      </Link>
      <img
        className="w-full object-cover rounded-lg"
        src={post && post.image}
        alt="post-image"
      />
      <div className="w-full flex justify-between mt-4 mb-8">
        <span className="italic">
          {post && new Date(post.createdAt).toLocaleDateString()}
        </span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      {post && <Comment postId={post._id} />}
      <div className="w-full">
        <h1 className="text-2xl text-center mb-10">Recent Articles</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 place-content-between gap-x-4 gap-y-12 mb-20">
          {recentPosts.length > 0 &&
            recentPosts.map((recentPost) => (
              <PostCard key={recentPost._id} post={recentPost} />
            ))}
        </div>
      </div>
    </main>
  );
};

export default PostPage;
