import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Css/Income.css";

const Navbar = ({ search, setSearch }) => (
  <nav className="navbar">
    <img src={`${process.env.PUBLIC_URL}/logo192.png`} alt="logo" className="logo"  />
    <input
      type="text"
      placeholder="Search expenses..."
      className="search-input"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </nav>
);

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="sidebar">
      <ul>
        <li onClick={() => navigate("/dashboard")}>Dashboard</li>
        <li onClick={() => navigate("/expenses")}>Expenses</li>
        <li onClick={() => navigate("/income")}>Income</li>
      </ul>
    </div>
  );
};

const Footer = () => (
  <footer className="footer">
    <p>&copy; 2025 ExpenSaver. All rights reserved.</p>
  </footer>
);

const Income = () => {
  const [search, setSearch] = useState("");



  return (
    <div className="expenses-container">
      <Navbar search={search} setSearch={setSearch} />
      <div className="main-content">
        <Sidebar />
        <h1>Coming Soon...</h1>
        <img src={`${process.env.PUBLIC_URL}/logo192.png`} alt="income-logo" className="income-logo" />
        <p style={{color:"grey",fontFamily:"cursive"}} >Updating by ExpenSaver</p>
       </div>
      <Footer />
    </div>
  );
};

export default Income;

