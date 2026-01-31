import { useState } from "react";
import img from "../assets/unnamed.jpg";
import { useNavigate } from "react-router-dom";

const UploadPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".pdf")) {
      setError("Please upload a PDF file");
      return;
    }

    setFile(selectedFile);
    setIsUploaded(true);
    setError(null);
  };

  const handleCancel = () => {
    setFile(null);
    setIsUploaded(false);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Update this URL for production
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

      const res = await fetch(`${API_URL}/generate-flow`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to process PDF");
      }

      const data = await res.json();
      console.log("Flowchart data received:", data);

      // Store data in localStorage
      localStorage.setItem("flowData", JSON.stringify(data));

      // Navigate to flowchart view
      navigate("/flowchart");
    } catch (error) {
      console.error("Upload failed:", error);
      setError(error.message || "Failed to process PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className="h-screen w-full bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: `url(${img})` }}
    >
      <div className="absolute inset-0 bg-black/15"></div>
      <div className="relative z-10 w-full max-w-md p-8 border-2 mb-5 border-dashed border-teal-400 rounded-xl text-center bg-white shadow-lg transition-all duration-300">
        {!isUploaded ? (
          /* INITIAL UPLOAD STATE */
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Upload Your PDF
            </h1>
            <h2 className="text-gray-500 mb-6">
              Convert PDF to flowchart instantly
            </h2>

            <label className="cursor-pointer flex flex-col items-center gap-3 group">
              <div className="text-5xl group-hover:scale-110 transition-transform">
                📄
              </div>
              <span className="text-teal-600 font-medium hover:underline">
                Click to upload PDF
              </span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </>
        ) : (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-3xl mb-4">
              ✓
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Conversion Complete!
            </h2>
            <p className="text-gray-500 text-sm mb-6 truncate w-full px-4">
              {file?.name}
            </p>
            <div className="flex gap-4 w-full justify-center">
              <button
                onClick={handleCancel}
                className="px-6 py-2 rounded-full border cursor-pointer border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-full bg-teal-600 cursor-pointer text-white font-medium hover:bg-teal-700 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={handleUpload}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Visualize Flowchart"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
