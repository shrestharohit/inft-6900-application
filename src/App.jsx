import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Import the logo image (you can replace this with the logo image or icon if needed)
import logo from './assets/Images/logo.png';  // Adjust path if necessary

import Home from './pages/Home';
import RegistrationForm from './pages/Registration';
import LoginForm from './pages/Login';

function App() {
  return (
    <div>
      <header style={styles.header}>
        {/* Logo Section */}
        <div style={styles.logo}>
          <img src={logo} alt="BrainWave Logo" style={styles.logoImage} />
          {/* BrainWave */}
        </div>

        {/* Categories Dropdown and Search Bar */}
        <select style={styles.dropdown}>
          <option value="categories">Categories</option>
        </select>
        <input type="text" placeholder="Search" style={styles.searchBar} />
      </header>

      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/registration">Registration</Link> |{" "}
        < Link to="/login">Login</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f1f1f1',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '30px', // Increase the font size for the logo
    fontWeight: 'bold',
  },
  logoImage: {
    width: '90px',  // Set the logo image size (increased to match the larger font size)
    height: '90px', // Set the logo image size
    marginRight: '10px', // Space between logo image and the name
  },
  dropdown: {
    padding: '5px',
    fontSize: '14px',
  },
  searchBar: {
    padding: '5px',
    fontSize: '14px',
  },
};

export default App;
