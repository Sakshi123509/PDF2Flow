import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-200 dark:bg-gray-900">
      {/* Logo */}
      <div
        className="text-xl font-bold text-teal-600 cursor-pointer"
        onClick={() => navigate("/")}
      >
        | PDF2Flow
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        <button
          onClick={() => navigate("/")}
          className="text-gray-700 dark:text-gray-300 font-semibold cursor-pointer hover:text-teal-600"
        >
          Home
        </button>
        <button
          onClick={() => navigate("/whystudent")}
          className="text-gray-700 dark:text-gray-300 font-semibold cursor-pointer hover:text-teal-600"
        >
          Features
        </button>

        <button
          onClick={() => navigate("/upload")}
          className="text-gray-700 dark:text-gray-300 font-semibold cursor-pointer hover:text-teal-600"
        >
          Upload
        </button>

        {/* Auth Buttons */}
        {/* <button
          className="bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 px-4 rounded"
          onClick={() => navigate("/login")}
        >
          Login
        </button>

        <button
          className="bg-amber-500 hover:bg-amber-400 text-white font-semibold py-2 px-4 rounded"
          onClick={() => navigate("/signup")}
        >
          Signup
        </button> */}
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden">
        <button className="text-gray-700 dark:text-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
