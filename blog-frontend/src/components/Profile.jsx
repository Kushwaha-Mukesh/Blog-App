import { useSelector } from "react-redux";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className=" w-full mx-4 md:w-1/2 md:mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <img
            src={currentUser.newUser.profilePicture}
            alt="user-profile"
            className="rounded-full w-full h-full object-cover border-4 border-[lightgray]"
          />
        </div>
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
