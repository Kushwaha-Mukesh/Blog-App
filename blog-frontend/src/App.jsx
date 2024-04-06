import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/Sign-Up";
import SignIn from "./pages/Sign-In";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sign-in" element={<SignUp />} />
        <Route path="/sign-up" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
