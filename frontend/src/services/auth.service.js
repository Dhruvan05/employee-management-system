import axios from "axios";

// The base URL for our authentication API
const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
  // Handles user login
  login(username, password) {
    return axios
      .post(API_URL + "signin", {
        username,
        password,
      })
      .then((response) => {
        // If the login is successful and we get a token
        if (response.data.token) {
          // Store the user info and token in localStorage
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  // Handles user logout
  logout() {
    // Just remove the user from localStorage
    localStorage.removeItem("user");
  }

  // Handles new user registration
  register(username, email, password, roles) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password,
      role: roles, // e.g., ["admin", "employee"]
    });
  }

  // Gets the current logged-in user's data from localStorage
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

const authService = new AuthService();
export default authService;