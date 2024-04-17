import { useSelector } from "react-redux";

const ThemeProvider = ({ children }) => {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div
      className={
        theme === "light"
          ? "bg-white text-gray-800 min-h-screen"
          : "text-gray-200 bg-[rgb(16,23,42)] min-h-screen"
      }
    >
      {children}
    </div>
  );
};

export default ThemeProvider;
