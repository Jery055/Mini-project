import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App"; // Login page
import Second from "./second"; // Dashboard page
import Third from "./third";
import Four from "./four";
import Five from "./five";
import Approver from "./Approver";
import Chatbot from "./components/Chatbot/Chatbot" // Make sure this matches the file name exactly

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Second />} />
        <Route path="/third" element={<Third />} />
        <Route path="/four" element={<Four />} />
        <Route path="/five" element={<Five />} />
        <Route path="/approver" element={<Approver />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;