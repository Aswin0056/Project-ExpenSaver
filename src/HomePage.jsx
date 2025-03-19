import React from "react";
import { useNavigate } from "react-router-dom";
import "./Css/HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo-container">
          <img src={`${process.env.PUBLIC_URL}/logo192.png`} alt="ExpenSaver Logo" className="homepage-logo" />
        </div>

        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-bar" />
        </div>

        <div className="nav-buttons">
          <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
          <button className="register-btn" onClick={() => navigate("/register")}>Register</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="content-container">
        {/* Left: Logo */}
        <div className="left-section">
          <img src={`${process.env.PUBLIC_URL}/only logo.png`} alt="ExpenSaver Logo" className="large-logo" />
        </div>

        {/* Right: App Description */}
        <div className="right-section">
          <h2>Welcome to ExpenSaver</h2>
          <p>
          <strong>ExpenSaver</strong> is a simple and easy-to-use personal finance tracker designed to help you manage your daily expenses effortlessly. With ExpenSaver, you can keep track of where your money goes, add and organize your expenses, and monitor your spending habits over time. Whether you want to set a budget, review past transactions, or manage your finances better, ExpenSaver provides all the tools you need in one place. Start using ExpenSaver today and take control of your financial future!
          </p>
          <h3>How to Use ExpenSaver?</h3>
          <ul>
            <li>📝 <strong>Sign up</strong> for an account to get started.</li>
            <li>🔐 <strong>Log in</strong> to your secure dashboard.</li>
            <li>➕ <strong>Add expenses</strong> with details like amount, category, and date.</li>
            <li>📊 <strong>View </strong>your transactions and track spending patterns.</li>
            <li>⚙️ <strong>Manage </strong>your expenses by editing or deleting unnecessary entries.</li>
          </ul>
          <p>Start tracking your expenses today and take control of your finances!</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
