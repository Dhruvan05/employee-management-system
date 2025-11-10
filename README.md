
# 🧑‍💼 HRM System (Employee Management)

This is a full-stack Human Resource Management (HRM) application built with a **Spring Boot backend** and a **React frontend**.

The application provides a complete system for managing employees and departments within an organization. It features a secure, token-based REST API for all backend operations and a dynamic, user-friendly React interface for interacting with the data.

---

## ✨ Key Features

* **Full CRUD Operations:** Create, Read, Update, and Delete employees and departments.
* **Authentication & Authorization:** Secure login and registration system using Spring Security and JSON Web Tokens (JWT).
* **Role-Based Access Control:** Features are protected based on user roles (e.g., `ROLE_ADMIN`, `ROLE_EMPLOYEE`).
* **Tabbed Interface:** A clean UI that separates:

  * Employee List
  * Add New Employee
  * Manage Departments
  * Reports
* **Search Functionality:** Instantly filter the employee list by name, email, designation, or department.
* **Reporting & Analytics:** A simple reports tab showing total employee and department counts, plus a breakdown of employees per department.
* **CSV Export:** Download the complete employee list as a `.csv` file directly from the reports tab.
* **Modal-Based Editing:** Smoothly update employee details without leaving the main page.

---

## 🧱 Tech Stack

### 🖥 Backend (Spring Boot)

* **Java 21**
* **Spring Boot 3.5.7**
* **Spring Security:** For handling authentication and route-level authorization.
* **Spring Data JPA:** For repository-based database interaction.
* **PostgreSQL:** The production-ready database.
* **Hibernate:** As the JPA implementation (`spring.jpa.hibernate.ddl-auto=create`).
* **jjwt (Java JWT):** For creating and validating JSON Web Tokens.
* **Maven:** For project and dependency management.

### 💻 Frontend (React)

* **React 19.2.0**
* **Create React App:** As the project boilerplate.
* **React Router 7.9.5:** For client-side routing and navigation.
* **Axios:** For making asynchronous HTTP requests to the backend API.
* **React-CSV:** For generating and downloading the employee report.
* **Jest & React Testing Library:** For unit and component testing.

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:

* **Java JDK 21** (or newer)
* **Maven** (or use the included Maven Wrapper)
* **Node.js** (v14 or newer)
* **PostgreSQL** (a running instance, either local or remote)

---

## ⚙️ Configuration

### 1. Backend (PostgreSQL)

The backend is configured to connect to a PostgreSQL database. You must update the configuration file to point to your local instance.

Edit `backend/src/main/resources/application.properties`:

```
spring.application.name=employee-system

# Server Port
server.port=8080

# --- Update these settings for your local PostgreSQL instance ---
spring.datasource.url=jdbc:postgresql://localhost:5432/your_db_name
spring.datasource.username=your_postgres_user
spring.datasource.password=your_postgres_password

# --- JPA SETTINGS FOR POSTGRESQL ---
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

# "create" will automatically create tables on startup.
# Change to "update" or "validate" for subsequent runs.
spring.jpa.hibernate.ddl-auto=create

# Good for debugging - shows the SQL commands in the console
spring.jpa.show-sql=true

# JWT Configuration
# REPLACE this with a long, strong, random string
app.jwtSecret=YourSuperLongAndVerySecureRandomSecretKeyGoesHere
app.jwtExpirationMs=86400000
```

---

### 2. Frontend

The frontend is pre-configured to connect to the backend at `http://localhost:8080`.
No changes are needed if you run the backend on the default port.

---

## ▶️ How to Run

### 1️⃣ Run the Backend

1. Open a terminal in the `backend` directory.
2. Ensure your PostgreSQL server is running and you have updated the `application.properties` file.
3. Run the application using the Maven wrapper:

```
# On macOS/Linux
./mvnw spring-boot:run

# On Windows
mvnw.cmd spring-boot:run
```

The backend will start on `http://localhost:8080`.
It will automatically create the necessary tables (`users`, `roles`, `employees`, `departments`) in your database.

---

### 2️⃣ Run the Frontend

1. Open a second terminal in the `frontend` directory.
2. Install the Node.js dependencies:

```
npm install
```

3. Start the React development server:

```
npm start
```

Your browser will automatically open to `http://localhost:3000`.
You can now register a new user (which defaults to `ROLE_EMPLOYEE` or `ROLE_ADMIN` based on frontend code) and use the application.

---

## 🔐 API & Security

The API is secured using JWT.
All requests to protected endpoints must include an `Authorization: Bearer <token>` header.
This token is provided upon successful login.

---

### 🌐 Public Endpoints

These endpoints are accessible without authentication.

| Method | Endpoint           | Description                       |
| ------ | ------------------ | --------------------------------- |
| POST   | `/api/auth/signin` | Logs in a user and returns a JWT. |
| POST   | `/api/auth/signup` | Registers a new user.             |

---

### 🔒 Protected Endpoints (Require ROLE_EMPLOYEE or ROLE_ADMIN)

These endpoints require a valid JWT.

| Method | Endpoint              | Description                    |
| ------ | --------------------- | ------------------------------ |
| GET    | `/api/employees`      | Get a list of all employees.   |
| POST   | `/api/employees`      | Create a new employee.         |
| GET    | `/api/employees/{id}` | Get a single employee by ID.   |
| PUT    | `/api/employees/{id}` | Update an existing employee.   |
| DELETE | `/api/employees/{id}` | Delete an employee.            |
| GET    | `/api/departments`    | Get a list of all departments. |
| POST   | `/api/departments`    | Create a new department.       |

---

## 📁 Project Structure

```
/
├── backend/
│   ├── src/main/java/com/hrmanagement/employee_system/
│   │   ├── config/       # Spring Security and CORS configuration
│   │   ├── controller/   # REST API controllers (Auth, Employee, Department)
│   │   ├── model/        # JPA entity classes (User, Role, Employee, Department)
│   │   ├── payload/      # Request/Response DTOs (LoginRequest, JwtResponse)
│   │   ├── repository/   # Spring Data JPA repositories
│   │   ├── security/     # JWT utils, filters, and user details service
│   │   └── EmployeeSystemApplication.java  # Main application entry point
│   ├── src/main/resources/
│   │   └── application.properties          # Database and app configuration
│   └── pom.xml                             # Backend Maven dependencies
│
└── frontend/
    ├── public/
    │   ├── index.html    # Main HTML template
    │   └── manifest.json # Web app manifest
    ├── src/
    │   ├── components/   # React components (EmployeeList, Login, Register)
    │   ├── services/     # Services for auth and auth headers
    │   ├── App.js        # Main app component with routing
    │   ├── App.css       # Main application styles
    │   └── index.js      # Frontend application entry point
    ├── package.json      # Frontend Node.js dependencies
    └── README.md         # Original Create React App README
```

---

## 🧾 License

This project is released under the **MIT License**.

---

## 👨‍💻 Author

**Dhruvan**
*B.E. Computer Science and Engineering*
📧 [Your Email Here]
🌐 [GitHub Profile](https://github.com/Dhruvan05)

---

This is the **entire file**, cleanly formatted and complete — including everything from your “2. Frontend” section and beyond.
Would you like me to add a **“Screenshots”** section template (for images or demo GIFs) at the bottom?
