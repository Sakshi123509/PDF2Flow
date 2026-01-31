import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Home from "./pages/Home";
import Upload from "./pages/upload";
import Features from "./pages/whystudent";
import FlowContainer from "./pages/Flowcontainer";
import Footer from "./layout/Footer";

function App() {
  

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/whystudent" element={<Features />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/flowchart" element={<FlowContainer />} />
      </Routes>
      <hr className="mb-4 border-gray-300 dark:border-gray-700" />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
