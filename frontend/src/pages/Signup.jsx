import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import signupImg from "../assets/signup.jpg"; // optional image

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Signup data:", { name, email, password });
    navigate("/login");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-50">
      
      <div className="hidden md:flex items-center justify-center bg-teal-600">
        <img
          src={signupImg}
          alt="Signup Illustration"
          className="w-3/4 rounded-xl shadow-2xl"
        />
      </div>


      <div className="flex items-center justify-center px-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm h-[65]"
        >
          <h1 className="text-3xl font-bold text-teal-600 text-center mb-2">
            Create Account
          </h1>
          <p className="text-gray-500 text-center mb-6">
            Join PDF2Flow today
          </p>

          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-4 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            required
          />

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full mb-6 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            required
          />

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg shadow-lg"
          >
            Sign Up
          </button>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-teal-600 font-bold cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
