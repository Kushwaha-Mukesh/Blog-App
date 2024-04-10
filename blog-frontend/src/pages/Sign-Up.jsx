import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <div className="w-full h-[90vh] flex flex-col sm:flex-row justify-center align-middle px-12">
      <div className="flex flex-col justify-center w-full sm:w-1/2 lg:w-1/3 mb-8 sm:mb-0">
        <h1 className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-1 text-white text-3xl px-2 w-fit">
          Mukesh's <span>Blog</span>
        </h1>
        <p className="text-lg mt-4">
          To accomplish great things,
          <br /> we must not only act, but also dream,
          <br /> not only plan, but also believe.
        </p>
      </div>
      <div className="flex flex-col justify-center align-middle w-full sm:w-1/2 lg:w-1/3">
        <form
          action=""
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label htmlFor="name">
            Name: <br />
            <input
              type="text"
              id="name"
              className="rounded-lg px-2 p-1 outline-none w-full"
              {...register("name", { required: true })}
            />
          </label>
          {errors.name && (
            <span className="text-sm text-red-500">This field is required</span>
          )}
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
          <label htmlFor="password">
            Password: <br />
            <input
              type="password"
              id="password"
              className="rounded-lg px-2 p-1 outline-none w-full"
              {...register("password", { required: true })}
            />
          </label>
          {errors.password && (
            <span className="text-sm text-red-500">This field is required</span>
          )}
          <button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-1 text-white px-2">
            Sign Up
          </button>
        </form>
        <button className="border rounded-lg px-2 p-1 text-white mt-4 mb-2">
          <FcGoogle className="inline mr-2 relative top-[-2px]" />
          Continue with Google
        </button>
        <span className="text-sm">
          Have an Account? <Link to={"/sign-in"}>Sign In</Link>
        </span>
      </div>
    </div>
  );
};

export default SignUp;
