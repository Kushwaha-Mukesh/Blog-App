import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const [publishError, setPublishError] = useState(null);

const CreatePost = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const handleUploadImage = async (e) => {
    e.preventDefault();
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Error uploading image");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadError(null);
            setImageUploadProgress(null);
            setFormData({ ...formData, image: downloadURL });
            setUploadedImage(downloadURL);
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/post/create", formData);
      if (res.data.success) {
        navigate(`/post/${res.data.data.slug}`);
      }
    } catch (error) {
      setPublishError(error.response.data.message);
      if (error.response.data.message === "Invalid Token!") {
        navigate("/sign-in");
      }
    }
  };
  return (
    <div className="min-h-screen w-full flex flex-col justify-center gap-4">
      <h1 className="text-3xl w-fit mx-auto mb-12">Create a Blog</h1>
      <form
        action=""
        className="flex flex-col gap-4 w-[80vw] md:w-[70vw] lg:w-[50vw] mx-auto"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4 lg:flex-row">
          <input
            type="text"
            required
            placeholder="Title"
            name="title"
            className="flex-1 bg-transparent py-1 px-1 rounded-lg outline-none border-2"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <select
            name="category"
            id="category"
            className="flex-2 bg-transparent py-1 px-1 rounded-lg outline-none border-2"
            required
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
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
            className="flex-1 py-1"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            className="flex-2 border border-blue-500 py-1 px-2 rounded-lg"
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-12 h-16 flex justify-center">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </button>
        </div>
        {imageUploadError && (
          <div className="bg-red-400 py-1 rounded-lg w-full text-center">
            {imageUploadError}
          </div>
        )}
        {uploadedImage && (
          <img
            src={uploadedImage}
            alt="post-image"
            className="w-full h-72 object-cover rounded-lg"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="start writing your blog..."
          className="h-72 mb-12"
          required
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-pink-500 py-1 rounded-lg"
        >
          Publish
        </button>
        {publishError && (
          <div className="bg-red-400 py-1 rounded-lg w-full text-center">
            {publishError}
          </div>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
