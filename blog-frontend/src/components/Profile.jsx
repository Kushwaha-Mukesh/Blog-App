import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const filePickerRef = useRef();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
        });
      }
    );
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  return (
    <div className=" w-full mx-4 md:w-1/2 md:mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-4">
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
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          readOnly
          defaultValue={currentUser.newUser.email}
          className="outline-none border-2 text-center py-1 rounded-lg bg-transparent"
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="outline-none border-2 text-center py-1 rounded-lg bg-transparent"
        />
        <button
          type="submit"
          className="hover:bg-gradient-to-r from-transparent via-blue-400 to-transparent border-2 py-1 rounded-lg"
        >
          Update
        </button>
      </form>
      <div className="flex justify-between text-red-500 mt-4">
        <span>Delete Account</span>
        <span>Sign Out</span>
      </div>
    </div>
  );
};

export default Profile;
