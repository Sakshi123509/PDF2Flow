import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Features from "./whystudent";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <>
        <section className="flex flex-col dark:bg-gray-900 items-center dark:text-gray-100 justify-center min-h-screen bg-gray-200 px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Convert PDFs to Flowcharts in Seconds
          </h1>

          <p className="text-gray-700 text-lg md:text-xl mb-8 max-w-xl">
            Upload your PDF and get a clear visual flowchart automatically.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/upload")}
              type="upload-file"
              className="bg-teal-800 hover:bg-teal-600 text-white font-semibold py-3 px-7 cursor-pointer rounded-full"
            >
              Upload PDF
            </button>
          </div>
          <section
            id="features"
            className="max-w-6xl mx-auto py-16 grid grid-cols-1 md:grid-cols-3 gap-8 px-4"
          >
            <div className="bg-white/80 backdrop-blur-sm border-2 border-purple-100 transform hover:scale-105 transition-all duration-300 p-6 rounded-xl text-blue-900 shadow hover:shadow-lg">
              <div className="text-4xl mb-3">🗺️</div>
              <h2 className="text-xl font-semibold mb-2">Mind-Maps</h2>
              <p className="text-gray-600">
                Radial visualization for brainstorming.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border-2 border-purple-100 transform hover:scale-105 transition-all duration-300 p-6 rounded-xl text-blue-900 shadow hover:shadow-lg">
              <div className="text-4xl mb-3">📊</div>
              <h2 className="text-xl font-semibold mb-2"> Flowcharts</h2>
              <p className="text-gray-600">
                Step-by-step process visualization.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border-2 border-purple-100 transform hover:scale-105 transition-all duration-300 p-6 rounded-xl text-blue-900 shadow hover:shadow-lg">
              <div className="text-4xl mb-3">🌳</div>{" "}
              <h2 className="text-xl font-semibold mb-2"> Hierarchies</h2>
              <p className="text-gray-600">Organized topic structures.</p>
            </div>
          </section>
        </section>
      <Features />
    </>
  );
};

export default Hero;
