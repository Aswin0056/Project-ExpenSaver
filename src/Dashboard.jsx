import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Css/Dashboard.css";

const Navbar = ({ handleLogout, username }) => (
  <nav className="navbar">
    <img src={`${process.env.PUBLIC_URL}/logo192.png`} alt="logo" className="logo" />
    <div className="navbar-right">
      <span className="user-username">{username}</span> {/* Show username */}
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
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
    <p>&copy; {new Date().getFullYear()} ExpenSaver. All rights reserved.</p>
  </footer>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [username, setUsername] = useState("");
  const [lastExpense, setLastExpense] = useState(
    JSON.parse(localStorage.getItem("lastExpense")) || null
  );

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    } else {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUserDetails();
      fetchLastExpense();
    }
  }
);

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setUsername(res.data.username); // ✅ Set username instead of email
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  // Fetch last expense
  const fetchLastExpense = async () => {
    try {
      const res = await axios.get("http://localhost:5000/last-expense", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      if (res.data) {
        setLastExpense(res.data);
        localStorage.setItem("lastExpense", JSON.stringify(res.data));
      }
    } catch (err) {
      console.error("Error fetching last expense:", err);
    }
  };

  // Handle Add Expense
  const handleAddExpense = async () => {
    if (!title || !amount) {
      alert("Title and Amount are required!");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post("http://localhost:5000/add-expense", {
        title,
        amount: parseFloat(amount),
        quantity: quantity ? parseInt(quantity) : null,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Update last expense when new expense is added
      const newExpense = {
        id: res.data.insertId,
        title,
        amount: parseFloat(amount),
        quantity: quantity || "-",
        created_at: new Date().toISOString(),
      };

      setLastExpense(newExpense);
      localStorage.setItem("lastExpense", JSON.stringify(newExpense));

      setTitle("");
      setAmount("");
      setQuantity("");
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("lastExpense");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      
      <Navbar handleLogout={handleLogout} username={username} /> {/* ✅ Show username */}
  
      <div className="main-content">
        <Sidebar />
        <div className="dashboard-content">
          <h2>Welcome to Your Dashboard, {username}!</h2> {/* ✅ Show username */}

          {/* Last Added Expense Section */}
          {lastExpense ? (
            <div className="last-expense">
              <h3>Last Added Expense</h3>
              <table className="expense-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Amount</th>
                    <th>Quantity</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{lastExpense.title}</td>
                    <td>₹{lastExpense.amount}</td>
                    <td>{lastExpense.quantity || "-"}</td>
                    <td>{new Date(lastExpense.created_at).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p>No expenses added yet.</p>
          )}

          {/* Add Expense Form */}
          <h3>Add New Expense</h3>
          <table className="add-expense-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    type="text"
                    placeholder="Enter title"
                    className="input-field"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="input-field"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="Enter quantity (optional)"
                    className="input-field"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </td>
                <td>
                  <button className="add-button" onClick={handleAddExpense}>
                    Add Expense
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
