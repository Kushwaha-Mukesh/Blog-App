import { Link, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { IoIosMoon, IoIosSunny } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../store/themeSlice";
import { signoutSuccess } from "../store/userSlice";
import axios from "axios";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [profile, setProfile] = useState(false);
  const searchRef = useRef();
  const navigate = useNavigate();
  const handleClick = () => {
    setShow(!show);
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

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?searchTerm=${searchRef.current.value}`);
  };

  return (
    <>
      <div className="flex align-middle justify-between py-6 mx-8">
        <Link to={"/"}>
          <p className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-1 text-white px-2">
            Mukesh's <span>Blog</span>
          </p>
        </Link>
        <form
          onSubmit={(e) => handleSearch(e)}
          className="border border-black py-1 px-2 rounded-lg"
        >
          <input
            type="text"
            name="search"
            ref={searchRef}
            placeholder="Search blog by name..."
            className="mr-1 focus:outline-none bg-transparent"
          />
          <button type="submit">
            <BsSearch />
          </button>
        </form>
        <div className="md:flex md:space-x-10 hidden">
          <Link to={"/"}>
            <span>Home</span>
          </Link>
          <Link to={"/about"}>
            <span>About</span>
          </Link>
          <Link to={"/projects"}>
            <span>Projects</span>
          </Link>
        </div>
        <div className="sm:flex justify-center hidden">
          <span
            className="text-lg rounded-full px-2 border-2 border-black cursor-pointer"
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "light" ? (
              <IoIosSunny className="relative top-1" />
            ) : (
              <IoIosMoon className="relative top-1" />
            )}
          </span>
          {currentUser ? (
            <div className="relative">
              <img
                src={currentUser.newUser.profilePicture}
                alt="user"
                className="w-8 rounded-full ml-2 cursor-pointer"
                onClick={() => setProfile(!profile)}
              />
              {profile && (
                <div className="flex flex-col gap-2 absolute px-4 py-2 rounded-lg right-0 mt-1 border-2 border-black bg-gray-700 text-gray-300">
                  <span>{currentUser.newUser.name}</span>
                  <Link to={"/dashboard?tab=profile"}>Profile</Link>
                  <span className="cursor-pointer" onClick={handleSignOut}>
                    Sign Out
                  </span>
                </div>
              )}
            </div>
          ) : (
            <Link
              to={"/sign-in"}
              className="border border-black rounded-lg px-2 ml-2"
            >
              Sign in
            </Link>
          )}
        </div>
        <div className="md:hidden cursor-pointer" onClick={handleClick}>
          {show ? (
            <RxCross2 className="text-[30px]" />
          ) : (
            <GiHamburgerMenu className="text-[30px]" />
          )}
        </div>
      </div>

      {show && (
        <div className="flex flex-col justify-between h-[80vh] absolute w-[200px] top-16 right-0 rounded-lg p-4 z-20 border-2 border-black bg-gray-700 text-gray-300">
          <div className="flex flex-col gap-4">
            <Link to={"/"}>
              <span>Home</span>
            </Link>
            <Link to={"/about"}>
              <span>About</span>
            </Link>
            <Link to={"/projects"}>
              <span>Projects</span>
            </Link>
            {currentUser && <Link to={"/dashboard?tab=profile"}>Profile</Link>}
          </div>
          <div className="w-full">
            <span
              className="text-lg rounded-lg px-2 cursor-pointer"
              onClick={() => dispatch(toggleTheme())}
            >
              {theme === "light" ? (
                <IoIosSunny className="ml-2" />
              ) : (
                <IoIosMoon className="ml-2" />
              )}
            </span>
            {currentUser ? (
              <span className="cursor-pointer" onClick={handleSignOut}>
                Sign Out
              </span>
            ) : (
              <Link to={"/sign-in"}>
                <button>Sign in</button>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
