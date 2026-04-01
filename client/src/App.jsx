import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import ManufacturerPage from "./pages/ManufacturerPage";
import VerifyPage from "./pages/VerifyPage";
import DashboardPage from "./pages/DashboardPage";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/home" element={<LandingPage />} />
        <Route path="/" element={
          <div className="page-container"><ManufacturerPage /></div>
        } />
        <Route path="/verify" element={
          <div className="page-container"><VerifyPage /></div>
        } />
        <Route path="/dashboard" element={
          <div className="page-container"><DashboardPage /></div>
        } />
      </Routes>
    </BrowserRouter>
  );
}