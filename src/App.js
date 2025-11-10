import React, { useState, useEffect } from "react";
// --- IMPORT useNavigate ---
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom"; 
import AuthService from "./services/auth.service";

// Import your new components
import Login from "./components/Login";
import Register from "./components/Register";
import EmployeeList from "./components/EmployeeList"; // Your main page

import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);
  const navigate = useNavigate(); // <-- ADD THIS

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []); // This still runs once on load

  // --- NEW: Function to handle successful login ---
  const handleLoginSuccess = () => {
    // Get the new user from storage and update state
    setCurrentUser(AuthService.getCurrentUser()); 
    // Navigate to employees page *after* state is set
    navigate("/employees");
  };
  // --- END NEW ---

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    navigate("/login"); // <-- ADD THIS to redirect after logout
  };

  // A helper component to protect your routes
  function ProtectedRoute({ children }) {
    const user = AuthService.getCurrentUser();
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  }

  return (
    <div className="App">
      <header className="App-header">
        <nav>
          {/* ... (your existing nav bar) ... */}
          <div className="nav-left">
            <Link to={"/"} className="nav-brand">HRM System</Link>
          </div>
          <div className="nav-right">
            {currentUser ? (
              <>
                <li className="nav-item"><Link to={"/employees"} className="nav-link">Employees</Link></li>
                <li className="nav-item"><a href="/login" className="nav-link" onClick={logOut}>Log Out ({currentUser.username})</a></li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link to={"/login"} className="nav-link">Login</Link></li>
                <li className="nav-item"><Link to={"/register"} className="nav-link">Sign Up</Link></li>
              </>
            )}
          </div>
        </nav>
      </header>

      <main>
        <Routes>
          {/* --- UPDATE THIS LINE --- */}
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          {/* --- END UPDATE --- */}

          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/employees" 
            element={<ProtectedRoute><EmployeeList /></ProtectedRoute>} 
          />
          
          <Route path="*" element={<Navigate to={currentUser ? "/employees" : "/login"} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;