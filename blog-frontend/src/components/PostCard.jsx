import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <Link
      to={`/post/${post.slug}`}
      className="group min-w-32 max-w-52 border-2 border-teal-800 rounded-lg flex flex-col justify-between p-2"
    >
      <img
        className="w-full h-40 rounded-lg object-cover transition ease-in-out group-hover:h-28"
        src={post.image}
        alt="post-image"
      />
      <h2 className="w-full text-lg whitespace-nowrap overflow-hidden text-ellipsis">
        {post.title}
      </h2>
      <span className="text-sm">{post.category}</span>
      <button className="border-2 py-1 mt-2 hidden transition ease-in-out group-hover:block rounded-lg">
        Read Article
      </button>
    </Link>
  );
};

export default PostCard;
