import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/Sign-Up";
import SignIn from "./pages/Sign-In";
import Header from "./components/Header";
import Projects from "./pages/Projects";
import PrivateRoute from "./components/PrivateRoute";
import CreatePost from "./pages/CreatePost";
import AdminRoute from "./components/AdminRoute";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { signInStart, signInFailure, signInSuccess } from "./store/userSlice";
import { useDispatch } from "react-redux";
import { ImSpinner10 } from "react-icons/im";
import Search from "./pages/Search";

const App = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  useEffect(() => {
    const isAuthenticate = async () => {
      try {
        dispatch(signInStart());
        const res = await axios.get("/api/auth/isAuthenticated");
        if (res.data.success) {
          dispatch(signInSuccess(res.data));
        }
      } catch (error) {
        dispatch(signInFailure(error.response.data));
      }
    };

    isAuthenticate();
  }, []);
  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center gap-2 h-[80vh] w-full text-xl">
          <ImSpinner10 className="animate-spin" />
          Loading...
        </div>
      ) : (
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/search" element={<Search />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route element={<AdminRoute />}>
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/update-post/:postId" element={<UpdatePost />} />
            </Route>
            <Route path="/post/:postSlug" element={<PostPage />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
