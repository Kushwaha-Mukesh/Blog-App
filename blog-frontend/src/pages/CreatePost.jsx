import { useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreatePost = () => {
  const fileRef = useRef();
  return (
    <div className="min-h-screen w-full flex flex-col justify-center gap-4">
      <h1 className="text-3xl w-fit mx-auto mb-12">Create a Blog</h1>
      <form
        action=""
        className="flex flex-col gap-4 w-[80vw] md:w-[70vw] lg:w-[50vw] mx-auto"
      >
        <div className="flex flex-col gap-4 lg:flex-row">
          <input
            type="text"
            required
            placeholder="Title"
            name="title"
            className="flex-1 bg-transparent py-1 px-1 rounded-lg outline-none border-2"
          />
          <select
            name="category"
            id="category"
            className="flex-2 bg-transparent py-1 px-1 rounded-lg outline-none border-2"
            required
          >
            <option value="" className="text-black">
              Select a Category
            </option>
            <option value="reactjs" className="text-black">
              ReactJs
            </option>
            <option value="javascript" className="text-black">
              Javascript
            </option>
            <option value="mern" className="text-black">
              Mern Stack
            </option>
            <option value="nextjs" className="text-black">
              NextJs
            </option>
          </select>
        </div>
        <div className="flex justify-between border-dotted border-2 border-sky-500 py-1 px-2 rounded-lg">
          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            className="flex-1 py-1"
          />
          <button
            className="flex-2 border border-blue-500 py-1 px-2 rounded-lg"
            onClick={() => fileRef.current.click()}
          >
            Upload Image
          </button>
        </div>
        <ReactQuill
          theme="snow"
          placeholder="start writing your blog..."
          className="h-72 mb-12"
          required
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-pink-500 py-1 rounded-lg"
        >
          Publish
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
