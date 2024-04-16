import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { ImSpinner9 } from "react-icons/im";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../store/userSlice";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading: isLoading, error } = useSelector((state) => state.user);
  const [showPass, setShowPass] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      dispatch(signInStart());
      const res = await axios.post("/api/auth/signIn", data);
      if (res.data.success) {
        dispatch(signInSuccess(res.data));
        navigate("/dashboard");
      }
    } catch (error) {
      dispatch(signInFailure(error.response.data));
    }
  };
  return (
    <div className="w-full h-[90vh] flex flex-col sm:flex-row justify-center align-middle px-12">
      <div className="flex flex-col justify-center w-full sm:w-1/2 lg:w-1/3 mb-8 sm:mb-0">
        <h1 className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg py-2 text-white text-3xl px-4 w-fit">
          Mukesh's <span>Blog</span>
        </h1>
        <p className="text-lg mt-4">
          The greatest glory in living lies not in never falling,
          <br /> but in rising every time we fall.
          <br /> - Nelson Mandela
        </p>
      </div>
      <div className="flex flex-col justify-center align-middle w-full sm:w-1/2 lg:w-1/3">
        <form
          action=""
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label htmlFor="email">
            Email: <br />
            <input
              type="email"
              id="email"
              className="rounded-lg px-2 p-1 outline-none w-full"
              {...register("email", { required: true })}
            />
          </label>
          {errors.email && (
            <span className="text-sm text-red-500">This field is required</span>
          )}
          <label htmlFor="password" className="relative">
            Password: <br />
            <input
              type={showPass ? "text" : "password"}
              id="password"
              className="rounded-lg px-2 p-1 outline-none w-full"
              {...register("password", { required: true })}
            />
            <span
              className="absolute right-2 bottom-[8px]"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <FaRegEyeSlash /> : <FaRegEye />}
            </span>
          </label>

          {errors.password && (
            <span className="text-sm text-red-500">This field is required</span>
          )}
          <button
            disabled={isLoading}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-1 text-white px-2 disabled:bg-gray-500"
          >
            {isLoading ? (
              <>
                {" "}
                <ImSpinner9 className="inline animate-spin" /> Loading...{" "}
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <OAuth />
        <span className="text-sm">
          Don't Have an Account? <Link to={"/sign-up"}>Sign Up</Link>
        </span>
      </div>
    </div>
  );
};

export default SignIn;
