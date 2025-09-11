import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Avatar, Menu, MenuItem } from '@mui/material'; // For profile icon and dropdown

// Import the logo image
import logo from './assets/Images/logo.png';

// Import pages/components
import Home from './pages/home';
import RegistrationForm from './pages/Registration';
import LoginForm from './pages/login';
import Login2FA from './Pages/login2fa';
import ForgotPassword from './Pages/forgotpassword';
import ProfileManagement from './Pages/profilemanagement';


function App() {
  const [anchorEl, setAnchorEl] = React.useState(null); // State for profile dropdown menu
  const open = Boolean(anchorEl);

  // Get the current route
  const location = useLocation();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear user session or authentication data
    localStorage.removeItem('userToken');
    sessionStorage.removeItem('userToken');
    window.location.href = "/";  // Redirect to homepage
  };

  return (
    <div style={styles.appContainer}>
      {/* Header Section */}
      <header style={styles.header}>
        {/* Logo Section */}
        <div style={styles.logoContainer}>
          <Link to="/">
            <img src={logo} alt="BrainWave Logo" style={styles.logoImage} />
          </Link>
        </div>

        {/* Categories Dropdown */}
        <div style={styles.dropdownContainer}>
          <select style={styles.dropdown}>
            <option value="categories">Categories</option>
            <option value="tech">Tech</option>
            <option value="business">Business</option>
          </select>
        </div>

        {/* Search Bar */}
        <input type="text" placeholder="Search..." style={styles.searchBar} />

        {/* Profile Icon or Login/Signup Button */}
        <div style={styles.profileContainer}>
          {/* Only show Profile Icon if we are on Profile Management page */}
          {location.pathname === '/profilemanagement' ? (
            <Avatar
              onClick={handleMenuOpen}
              style={styles.avatar}
            />
          ) : (
            <Link to="/login" style={styles.loginButton}>
              <button style={styles.button}>Login/Signup</button>
            </Link>
          )}

          {/* Profile Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => window.location.href = '/profilemanagement'}>Edit Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </header>

      {/* Navigation Links */}
      <nav style={styles.navBar}>
        <Link to="/" style={styles.navLink}>Home</Link>
        <Link to="/registration" style={styles.navLink}>Registration</Link>
        <Link to="/login" style={styles.navLink}>Login</Link>
        <Link to="/login2fa" style={styles.navLink}>Login 2FA</Link>
        <Link to="/forgotpassword" style={styles.navLink}>Forgot Password</Link>
        <Link to="/profilemanagement" style={styles.navLink}>Profile Management</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/login2fa" element={<Login2FA />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/profilemanagement" element={<ProfileManagement />} />
      </Routes>

      {/* Footer Section */}
      <footer style={styles.footer}>
        <div style={styles.footerLinks}>
          <Link to="/about" style={styles.footerLink}>About</Link>
          <Link to="/contact" style={styles.footerLink}>Contact Us</Link>
          <Link to="/terms" style={styles.footerLink}>Terms & Conditions</Link>
        </div>
        <div style={styles.footerText}>
          <p>&copy; {new Date().getFullYear()} BrainWave. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh', // Ensure footer sticks at bottom
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 10px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    height: "80px"
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '30px',
    fontWeight: 'bold',
  },
  logoImage: {
    width: '200px',
    height: '140px',
    marginRight: '10px',
    cursor: 'pointer',
  },
  dropdownContainer: {
    marginLeft: '20px',
  },
  dropdown: {
    padding: '8px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  searchBar: {
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    width: '40%',
    margin: '0 auto',
  },
  profileContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  avatar: {
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
  },
  loginButton: {
    marginLeft: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#db4437',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  navBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: '0px',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    padding: '8px 20px',
    margin: '0 10px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '4px',
  },
  footer: {
    backgroundColor: "#333",
    color: "#fff",
    padding: "20px 0",
    textAlign: "center",
    marginTop: "auto",
  },
  footerLinks: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  footerLink: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "16px",
  },
  footerText: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#ccc",
  },
};

export default App;
