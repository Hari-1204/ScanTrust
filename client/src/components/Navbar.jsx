import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  const links = [
    { to: "/home", label: "Home" },
    { to: "/", label: "Register Product" },
    { to: "/verify", label: "Verify Product" },
    { to: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
  <div className="navbar-brand-icon">ST</div>
  ScanTrust
</div>
    </nav>
  );
}