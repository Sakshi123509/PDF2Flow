import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImg from "../assets/login.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate API Login Logic
    console.log("Logging in with:", { email, password });

    // On success, redirect to the upload page or home
    navigate("/upload");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-50">
      <div className="hidden md:flex items-center justify-center bg-teal-400">
        <img
          src={loginImg}
          alt="Signup Illustration"
          className="w-3/4 rounded-xl shadow-2xl"
        />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
        {/* Brand Identity */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-amber-600">PDF2Flow</h1>
          <p className="text-gray-500 mt-2">
            Log in to manage your conversions
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            Welcome Back
          </h2>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block mb-2 text-sm text-gray-600 font-semibold">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block mb-2 text-sm text-gray-600 font-semibold">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all active:scale-[0.98]"
          >
            Login
          </button>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <span
              className="text-amber-500 font-bold cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
