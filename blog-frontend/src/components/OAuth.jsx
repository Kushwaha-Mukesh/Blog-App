import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInFailure, signInSuccess } from "../store/userSlice";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth(app);
  const handleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" }); // this code allow user to select email each time user click continue with google
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const res = await axios.post("/api/auth/google", {
        name: resultFromGoogle.user.displayName,
        email: resultFromGoogle.user.email,
        googlePhotoUrl: resultFromGoogle.user.photoURL,
      });

      if (res.data.success) {
        dispatch(signInSuccess(res.data));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      className="border-2 border-black rounded-lg px-2 p-1 mt-4 mb-2"
      onClick={handleClick}
    >
      <FcGoogle className="inline mr-2 relative top-[-2px]" />
      Continue with Google
    </button>
  );
};

export default OAuth;
