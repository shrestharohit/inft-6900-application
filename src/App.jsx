import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Import the logo image
import logo from './assets/Images/logo.png';  // Adjust path if necessary

// Import pages/components
import Home from './pages/Home';
import RegistrationForm from './pages/Registration';
import LoginForm from './pages/login';
import Login2FA from './Pages/login2fa';
import ForgotPassword from './Pages/forgotpassword';  // Import ForgotPassword component

function App() {
  return (
    <div>
      {/* Header Section */}
      <header style={styles.header}>
        {/* Logo Section */}
        <div style={styles.logoContainer}>
          <img src={logo} alt="BrainWave Logo" style={styles.logoImage} />
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

        {/* Login/Sign Up Button */}
        <Link to="/login" style={styles.loginButton}>
          <button style={styles.button}>SignUp/Login</button>
        </Link>
      </header>

      {/* Navigation Links */}
      <nav style={styles.navBar}>
        <Link to="/" style={styles.navLink}>Home</Link>
        <Link to="/registration" style={styles.navLink}>Registration</Link>
        <Link to="/login" style={styles.navLink}>Login</Link>
        <Link to="/login2fa" style={styles.navLink}>Login 2FA</Link>
        <Link to="/forgotpassword" style={styles.navLink}>Forgot Password</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/login2fa" element={<Login2FA />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
      </Routes>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 10px', // Reduced the padding for a smaller header
    backgroundColor: '#4CAF50', // Green background for header
    color: '#fff',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '30px',
    fontWeight: 'bold',
  },
  logoImage: {
    width: '200px', // Increased logo size to fill the header and make it more readable
    height: 'auto',
    marginRight: '10px',
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
    width: '40%', // Making search bar bigger
    margin: '0 auto', // Centering the search bar
  },
  loginButton: {
    marginLeft: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#db4437', // Red color for Login button
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
    padding: '2px 0', // Reduced padding to make the nav bar smaller
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
};

export default App;
