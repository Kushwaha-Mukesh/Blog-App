import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ImSpinner10 } from "react-icons/im";

const PostPage = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState();
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
    <main>
      <h1>{post && post.title}</h1>
      <Link to={`/search?category=${post && post.category}`}>
        {post && post.category}
      </Link>
      <img src={post && post.image} alt="post-image" />
      <div>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span>{post && (post.content.length / 1000).toFixed(0)} mins read</span>
      </div>
      <div dangerouslySetInnerHTML={{ __html: post && post.content }}></div>
    </main>
  );
};

export default PostPage;
