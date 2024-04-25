import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteStart,
  deleteSuccess,
  deleteFailure,
  signoutSuccess,
} from "../store/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import { IoInformationCircleOutline } from "react-icons/io5";

const Profile = () => {
  const { currentUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError("Could not upload image (File must be 2MB)");
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserSuccess(null);
    setUpdateUserError(null);
    console.log(formData);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes were made!");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait image for upload!");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await axios.put(
        `/api/user/update/${currentUser.newUser._id}`,
        formData,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(updateSuccess(res.data));
        setUpdateUserSuccess("User Profile Updated Successfully!");
      }
    } catch (error) {
      dispatch(updateFailure(error.response.data));
    }
  };

  const handleDelete = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowModal(false);
    try {
      dispatch(deleteStart());
      const res = await axios.delete(
        `/api/user/delete/${currentUser.newUser._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(deleteSuccess());
      }
    } catch (error) {
      dispatch(deleteFailure(error.response.data));
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await axios.get("/api/user/signOut");
      if (res.data.success) {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className=" w-full mx-4 md:w-1/2 md:mx-auto">
        <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={filePickerRef}
            hidden
          />
          <div
            className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
            onClick={() => filePickerRef.current.click()}
          >
            {imageFileUploadProgress && (
              <CircularProgressbar
                value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={5}
                styles={{
                  root: {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  },
                  path: {
                    stroke: `rgba(62, 152, 199, ${
                      imageFileUploadProgress / 100
                    })`,
                  },
                }}
              />
            )}
            <img
              src={imageFileUrl || currentUser.newUser.profilePicture}
              alt="user-profile"
              className={`rounded-full w-full h-full object-cover border-4 border-[lightgray] ${
                imageFileUploadProgress &&
                imageFileUploadProgress < 100 &&
                "opacity-50"
              }`}
            />
          </div>
          {imageFileUploadError && (
            <span className="bg-red-400 text-white text-center py-1 rounded-lg">
              {imageFileUploadError}
            </span>
          )}
          <input
            type="text"
            id="name"
            placeholder="Your Name"
            defaultValue={currentUser.newUser.name}
            className="outline-none border-2 text-center py-1 rounded-lg bg-transparent"
            onChange={handleChange}
          />
          <input
            type="email"
            id="email"
            placeholder="Email"
            readOnly
            defaultValue={currentUser.newUser.email}
            className="outline-none border-2 text-center py-1 rounded-lg bg-transparent"
            onChange={handleChange}
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="outline-none border-2 text-center py-1 rounded-lg bg-transparent"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="hover:bg-gradient-to-r from-transparent via-blue-400 to-transparent border-2 py-1 rounded-lg"
            disabled={loading || imageFileUploading}
          >
            {loading ? "Loading..." : "Update"}
          </button>
        </form>
        <div className="flex justify-between text-red-500 my-4">
          <span onClick={handleDelete} className="cursor-pointer">
            Delete Account
          </span>
          <span onClick={handleSignOut} className="cursor-pointer">
            Sign Out
          </span>
        </div>
        {updateUserSuccess && (
          <span className="w-full text-center bg-green-600 py-1 rounded-lg px-2">
            {updateUserSuccess}
          </span>
        )}

        {updateUserError && (
          <span className="w-full text-center bg-red-600 py-1 rounded-lg px-2">
            {updateUserError}
          </span>
        )}
      </div>

      {showModal && (
        <div className="absolute top-1/2 left-1/2 rounded-lg p-4 text-center flex flex-col gap-2 bg-gray-800 text-white">
          <IoInformationCircleOutline className="self-center text-3xl" />
          <p className="text-lg">Are you sure want to Delete ?</p>
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

export default Profile;
