import React, { useState, useEffect, useMemo } from 'react'; // <-- IMPORT useMemo
import axios from 'axios';
import authHeader from '../services/auth-header'; 
import { CSVLink } from 'react-csv'; // <-- IMPORT CSVLink
import '../App.css'; 

function EmployeeList() { 
  // --- All existing state... ---
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    firstName: '', lastName: '', email: '', designation: '', department: { id: '' } 
  });
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  // --- Reusable function to fetch employees ---
  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/employees', { headers: authHeader() });
      setEmployees(response.data);
    } catch (err) {
      setError('Error fetching data. You may not be authorized.');
      console.error("Error fetching employees:", err);
    }
  };

  // --- Reusable function to fetch departments ---
  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/departments', { headers: authHeader() });
      if (Array.isArray(response.data)) {
        setDepartments(response.data);
      } else {
        console.error("Fetched departments is not an array:", response.data);
        setDepartments([]);
      }
    } catch (err) {
      console.error("Error fetching departments", err);
      setDepartments([]);
    }
  };

  // --- Initial Data Load ---
  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []); 

  // --- Search Filter Effect ---
  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    
    const filtered = employees.filter(employee => {
      const matchesFirstName = employee.firstName && employee.firstName.toLowerCase().includes(lowerCaseSearchTerm);
      const matchesLastName = employee.lastName && employee.lastName.toLowerCase().includes(lowerCaseSearchTerm);
      const matchesEmail = employee.email && employee.email.toLowerCase().includes(lowerCaseSearchTerm);
      const matchesDesignation = employee.designation && employee.designation.toLowerCase().includes(lowerCaseSearchTerm);
      const matchesDepartment = employee.department && employee.department.name.toLowerCase().includes(lowerCaseSearchTerm);

      return matchesFirstName || matchesLastName || matchesEmail || matchesDesignation || matchesDepartment;
    });
    
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  // --- Form Input Handlers ---
  const handleEmployeeInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'department') {
      setNewEmployee(prevState => ({ ...prevState, department: { id: value } }));
    } else {
      setNewEmployee(prevState => ({ ...prevState, [name]: value }));
    }
  };

  const handleDepartmentInputChange = (e) => {
    setNewDepartmentName(e.target.value);
  };

  // --- Form Submit Handlers ---
  const handleEmployeeSubmit = async (e) => {
    e.preventDefault(); 
    if (!newEmployee.firstName || !newEmployee.email || !newEmployee.department.id) {
      alert("Please fill out First Name, Email, and Department.");
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/api/employees', newEmployee, { headers: authHeader() });
      const savedEmployee = response.data;
      alert('Employee added successfully!');
      setEmployees(prevEmployees => [...prevEmployees, savedEmployee]);
      setNewEmployee({ firstName: '', lastName: '', email: '', designation: '', department: { id: '' } });
      setActiveTab('list'); 
      setSearchTerm(""); 
    } catch (err) {
      console.error("Error adding employee:", err);
      alert('Error adding employee. Please try again.');
    }
  };

  const handleDepartmentSubmit = async (e) => {
    e.preventDefault();
    if (!newDepartmentName) {
      alert("Please enter a department name.");
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/api/departments', { name: newDepartmentName }, { headers: authHeader() });
      const savedDepartment = response.data;
      alert('Department added successfully!');
      setDepartments(prevDepartments => [...prevDepartments, savedDepartment]);
      setNewDepartmentName(''); 
    } catch (err) {
      console.error("Error adding department:", err);
      alert('Error adding department. Please try again.');
    }
  };

  // --- Delete Handler ---
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:8080/api/employees/${id}`, { headers: authHeader() });
        alert('Employee deleted successfully!');
        setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== id));
      } catch (err) {
        console.error("Error deleting employee:", err);
        alert('Error deleting employee. Please try again.');
      }
    }
  };

  // --- Update Modal Handlers ---
  const openEditModal = (employee) => {
    setCurrentEmployee({
      ...employee,
      department: employee.department ? { id: employee.department.id } : { id: '' }
    });
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setCurrentEmployee(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'department') {
      setCurrentEmployee(prevState => ({ ...prevState, department: { id: value } }));
    } else {
      setCurrentEmployee(prevState => ({ ...prevState, [name]: value }));
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!currentEmployee.firstName || !currentEmployee.email || !currentEmployee.department.id) {
      alert("Please fill out First Name, Email, and Department.");
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8080/api/employees/${currentEmployee.id}`, currentEmployee, { headers: authHeader() });
      const updatedEmployee = response.data;
      alert('Employee updated successfully!');
      closeEditModal(); 
      setEmployees(prevEmployees => 
        prevEmployees.map(emp => 
          emp.id === updatedEmployee.id ? updatedEmployee : emp
        )
      );
    } catch (err) {
      console.error("Error updating employee:", err);
      alert('Error updating employee. Please try again.');
    }
  };
  
  // --- Calculate Stats for Reports ---
  const departmentCounts = useMemo(() => {
    const counts = {};
    employees.forEach(employee => {
      const deptName = employee.department ? employee.department.name : 'Unassigned';
      counts[deptName] = (counts[deptName] || 0) + 1;
    });
    return counts;
  }, [employees]); // Recalculate only when employees array changes

  // --- Prepare Data for CSV Export ---
  const csvHeaders = [
    { label: "Employee ID", key: "id" },
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Email", key: "email" },
    { label: "Designation", key: "designation" },
    { label: "Department", key: "department.name" }
  ];

  const csvData = useMemo(() => {
    return employees.map(emp => ({
      id: emp.id,
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      designation: emp.designation,
      "department.name": emp.department ? emp.department.name : 'N/A'
    }));
  }, [employees]);


  // --- JSX Rendering ---
  return (
    <>
      {/* --- Tab Navigation (with new Reports tab) --- */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Employee List
        </button>
        <button
          className={`tab-btn ${activeTab === 'addEmployee' ? 'active' : ''}`}
          onClick={() => setActiveTab('addEmployee')}
        >
          Add Employee
        </button>
        <button
          className={`tab-btn ${activeTab === 'addDept' ? 'active' : ''}`}
          onClick={() => setActiveTab('addDept')}
        >
          Manage Departments
        </button>
        <button
          className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
      </div>

      {/* --- Tab Content --- */}
      <div className="tab-content">
        
        {/* --- Tab 1: Employee List --- */}
        {activeTab === 'list' && (
          <div>
            <h2>Employee List</h2>
            {error && <p className="error">{error}</p>}
            <div className="form-group" style={{ maxWidth: '400px', margin: '20px 0' }}>
              <input 
                type="text"
                placeholder="Search by name, email, designation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(emp => (
                  <tr key={emp.id}>
                    <td>{emp.firstName} {emp.lastName}</td>
                    <td>{emp.email}</td>
                    <td>{emp.designation}</td>
                    <td>{emp.department ? emp.department.name : 'N/A'}</td>
                    <td>
                      <button className="action-btn update-btn" onClick={() => openEditModal(emp)}>Update</button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(emp.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- Tab 2: Add Employee --- */}
        {activeTab === 'addEmployee' && (
          <div className="form-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Add New Employee</h2>
            <form onSubmit={handleEmployeeSubmit}>
              <div className="form-group"><label>First Name</label><input type="text" name="firstName" placeholder="e.g., Dhruvan" value={newEmployee.firstName} onChange={handleEmployeeInputChange} /></div>
              <div className="form-group"><label>Last Name</label><input type="text" name="lastName" placeholder="e.g., User" value={newEmployee.lastName} onChange={handleEmployeeInputChange} /></div>
              <div className="form-group"><label>Email</label><input type="email" name="email" placeholder="e.g., dhruvan@example.com" value={newEmployee.email} onChange={handleEmployeeInputChange} /></div>
              <div className="form-group"><label>Designation</label><input type="text" name="designation" placeholder="e.g., Project Lead" value={newEmployee.designation} onChange={handleEmployeeInputChange} /></div>
              <div className="form-group">
                <label>Department</label>
                <select name="department" value={newEmployee.department.id} onChange={handleEmployeeInputChange}>
                  <option value="">Select Department</option>
                  {departments.map(dept => (<option key={dept.id} value={dept.id}>{dept.name}</option>))}
                </select>
              </div>
              <button type="submit" className="submit-btn">Add Employee</button>
            </form>
          </div>
        )}

        {/* --- Tab 3: Add Department --- */}
        {activeTab === 'addDept' && (
          <div className="form-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Add New Department</h2>
            <form onSubmit={handleDepartmentSubmit}>
              <div className="form-group"><label>Department Name</label><input type="text" name="departmentName" placeholder="e.g., Engineering" value={newDepartmentName} onChange={handleDepartmentInputChange} /></div>
              <button type="submit" className="submit-btn">Add Department</button>
            </form>
          </div>
        )}

        {/* --- Tab 4: Reports --- */}
        {activeTab === 'reports' && (
          <div className="form-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2>Reports & Analytics</h2>
            
            <div className="report-stats">
              <div className="stat-card">
                <h3>Total Employees</h3>
                <p>{employees.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Departments</h3>
                <p>{departments.length}</p>
              </div>
            </div>

            <div className="department-breakdown">
              <h3>Employees per Department</h3>
              <ul>
                {Object.entries(departmentCounts).map(([name, count]) => (
                  <li key={name}>
                    <strong>{name}:</strong> {count} employee(s)
                  </li>
                ))}
              </ul>
            </div>

            <hr />

            <h3>Export Data</h3>
            <p>Download a CSV file of all employees.</p>
            <CSVLink
              data={csvData}
              headers={csvHeaders}
              filename={"employee_report.csv"}
              className="submit-btn" // Reuse your button style
              style={{ textDecoration: 'none', display: 'inline-block', width: 'auto' }}
            >
              Download Employee Report (CSV)
            </CSVLink>
          </div>
        )}

      </div>

      {/* --- Update Modal (unchanged) --- */}
      {isModalOpen && currentEmployee && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Edit Employee</h2>
            <form onSubmit={handleUpdateSubmit}>
              <div className="form-group"><label>First Name</label><input type="text" name="firstName" value={currentEmployee.firstName} onChange={handleEditInputChange} /></div>
              <div className="form-group"><label>Last Name</label><input type="text" name="lastName" value={currentEmployee.lastName} onChange={handleEditInputChange} /></div>
              <div className="form-group"><label>Email</label><input type="email" name="email" value={currentEmployee.email} onChange={handleEditInputChange} /></div>
              <div className="form-group"><label>Designation</label><input type="text" name="designation" value={currentEmployee.designation} onChange={handleEditInputChange} /></div>
              <div className="form-group">
                <label>Department</label>
                <select name="department" value={currentEmployee.department.id} onChange={handleEditInputChange}>
                  <option value="">Select Department</option>
                  {departments.map(dept => (<option key={dept.id} value={dept.id}>{dept.name}</option>))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="submit-btn">Save Changes</button>
                <button type="button" className="action-btn cancel-btn" onClick={closeEditModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default EmployeeList;