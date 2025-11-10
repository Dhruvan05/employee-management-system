import React, { useState } from "react";
import AuthService from "../services/auth.service";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    // For simplicity, we register every new user as an "admin"
    // In a real app, you'd control this
    const roles = ["admin"]; 

    AuthService.register(username, email, password, roles).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
      }
    );
  };

  return (
    <div className="form-container" style={{ maxWidth: "500px", margin: "50px auto" }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        {!successful && (
          <div>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <button className="submit-btn">Sign Up</button>
            </div>
          </div>
        )}

        {message && (
          <div className="form-group">
            <div
              className={successful ? "alert alert-success" : "alert alert-danger"}
              role="alert"
            >
              {message}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Register;