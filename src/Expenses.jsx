import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Css/Expenses.css";

const Navbar = ({ search, setSearch }) => (
  <nav className="navbar">
    <img src={`${process.env.PUBLIC_URL}/logo192.png`} alt="logo" className="logo" />
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

const Expenses = () => {
  const [search, setSearch] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const fetchExpenses = async () => {
    const token = localStorage.getItem("authToken");
  
    if (!token) {
      console.error("No auth token found. Redirecting to login...");
      navigate("/login"); // Redirect if no token
      return;
    }
  
    try {
      const res = await axios.get("http://localhost:5000/expenses", {
        headers: { Authorization: `Bearer ${token}` }, // Ensure token is sent
      });
  
      console.log("Expenses Fetched:", res.data);
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err.response?.data?.error || err.message);
  
      if (err.response?.status === 401) {
        console.log("Unauthorized! Redirecting to login...");
        localStorage.removeItem("authToken"); // Remove invalid token
        navigate("/login");
      }
    }
  };
  

  useEffect(() => {
    if (token) {
      fetchExpenses();
    } else {
      navigate("/login");
    }
  });

  const grandTotal = expenses.reduce(
    (total, expense) => total + expense.amount * (expense.quantity || 1),
    0
  );

  const handleEdit = (expense) => {
    setEditingExpense({ ...expense });
  };

  const handleInputChange = (e, field) => {
    setEditingExpense((prevExpense) => ({
      ...prevExpense,
      [field]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    if (!editingExpense) return;

    try {
      await axios.put(
        `http://localhost:5000/update-expense/${editingExpense.id}`,
        editingExpense,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchExpenses();
      setEditingExpense(null);
    } catch (err) {
      console.error("Error updating expense:", err.response?.data?.error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      await axios.delete(`http://localhost:5000/delete-expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err.response?.data?.error);
    }
  };

  return (
    <div className="expenses-container">
      <Navbar search={search} setSearch={setSearch} />
      <div className="main-content">
        <Sidebar />
        <div className="expenses-content">
          <h2>Expense History</h2>
          <table className="expense-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount (₹)</th>
                <th>Quantity</th>
                <th>Total (₹)</th>
                <th>Date & Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses
                .filter((expense) =>
                  expense.title.toLowerCase().includes(search.toLowerCase())
                )
                .map((expense) => (
                  <tr key={expense.id}>
                    {editingExpense?.id === expense.id ? (
                      <>
                        <td>
                          <input
                            type="text"
                            value={editingExpense.title}
                            onChange={(e) => handleInputChange(e, "title")}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={editingExpense.amount}
                            onChange={(e) => handleInputChange(e, "amount")}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={editingExpense.quantity || ""}
                            onChange={(e) => handleInputChange(e, "quantity")}
                          />
                        </td>
                        <td>
                          {(editingExpense.amount * (editingExpense.quantity || 1)).toFixed(2)}
                        </td>
                        <td>{new Date(editingExpense.created_at).toLocaleString()}</td>
                        <td className="action-button">
                          <button className="update-button" onClick={handleUpdate}>Update</button>
                          <button className="cancel-button" onClick={() => setEditingExpense(null)}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{expense.title}</td>
                        <td>{expense.amount}</td>
                        <td>{expense.quantity || "-"}</td>
                        <td>{(expense.amount * (expense.quantity || 1)).toFixed(2)}</td>
                        <td>{new Date(expense.created_at).toLocaleString()}</td>
                        <td>
                          <button className="edit-button" onClick={() => handleEdit(expense)}>Edit</button>
                          <button className="delete-button" onClick={() => handleDelete(expense.id)}>Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              <tr className="grand-total-row">
                <td colSpan="3"><strong>Grand Total</strong></td>
                <td><strong>₹ {grandTotal.toFixed(2)}</strong></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Expenses;
