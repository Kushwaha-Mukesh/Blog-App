import { Link } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { IoIosMoon } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";

const Header = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => {
    setShow(!show);
  };
  return (
    <>
      <div className="flex align-middle justify-between p-2">
        <Link to={"/"}>
          <p className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-1 text-white px-2">
            Mukesh's <span>Blog</span>
          </p>
        </Link>
        <form className="border border-black py-1 px-2 rounded-lg">
          <input
            type="text"
            name="search"
            placeholder="Search blog by name..."
            className="mr-1 focus:outline-none bg-transparent"
          />
          <button type="submit">
            <BsSearch />
          </button>
        </form>
        <div className="md:flex md:space-x-16 hidden">
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
          <span className="text-lg bg-black text-white rounded-lg px-2">
            <IoIosMoon className="relative top-2" />
          </span>
          <Link
            to={"/sign-in"}
            className="border border-black rounded-lg px-2 ml-2"
          >
            Sign in
          </Link>
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
        <div className="flex flex-col justify-between h-[80vh] absolute bg-white w-[200px] top-12 right-0 rounded-lg p-4">
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
          </div>
          <div className="w-full">
            <span className="text-lg w-full rounded-lg px-2">
              <IoIosMoon />
            </span>
            <Link to={"/sign-in"}>
              <button>Sign in</button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
