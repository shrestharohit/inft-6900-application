import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Menu, MenuItem, Button, Box, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// Import the logo image
import logo from './assets/Images/logo.png';

// Import pages/components (public)
import Home from './pages/home';
import RegistrationForm from './pages/Registration';
import LoginForm from './pages/login';
import Login2FA from './Pages/login2fa';
import ForgotPassword from './Pages/forgotpassword';
import ProfileManagement from './Pages/profilemanagement';

// Admin imports
import AdminLayout from "./Pages/Admin/adminlayout";
import AdminUserManagement from "./Pages/Admin/adminUserManagement";
import AdminCourseApproval from "./Pages/Admin/adminCourseApproval";
import {
  DashboardPage,
  PathwaysPage,
  CoursesPage,
  EnrollmentsPage,
  ReportsPage,
  MessagesPage,
  SettingsPage
} from "./Pages/Admin/pagesPlaceholders";

// Course Owner imports
import CourseManagement from "./Pages/CourseOwner/courseManagement";
import CourseOwnerLayout from "./Pages/CourseOwner/courseOwnerLayout";

// Placeholder for Courses & Pathways
const CoursePage = ({ name }) => <h2 style={{ textAlign: "center", marginTop: "2rem" }}>Welcome to {name}</h2>;
const PathwayPage = ({ name }) => <h2 style={{ textAlign: "center", marginTop: "2rem" }}>{name} Pathway Details</h2>;

// Placeholder for Course Owner pages
const Placeholder = ({ title }) => (
  <h2 style={{ textAlign: "center", marginTop: "2rem" }}>{title}</h2>
);

function App() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [categoryAnchor, setCategoryAnchor] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const open = Boolean(anchorEl);
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication status on component mount and route changes
  useEffect(() => {
    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    sessionStorage.removeItem('userToken');
    setIsLoggedIn(false);
    setAnchorEl(null);
    navigate('/');
  };

  // Category dropdown
  const handleCategoryOpen = (event) => setCategoryAnchor(event.currentTarget);
  const handleCategoryClose = () => setCategoryAnchor(null);
  const goTo = (path) => {
    navigate(path);
    handleCategoryClose();
  };

  // Check if we are in admin or courseOwner area
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isCourseOwnerRoute = location.pathname.startsWith("/courseowner");

  return (
    <div style={styles.appContainer}>
      {/* Show Header only on non-admin & non-courseOwner routes */}
      {!isAdminRoute && !isCourseOwnerRoute && (
        <>
          <header style={styles.header}>
            <div style={styles.logoContainer}>
              <Link to="/">
                <img src={logo} alt="BrainWave Logo" style={styles.logoImage} />
              </Link>
            </div>

            {/* Categories Dropdown */}
            <div>
              <Button
                onClick={handleCategoryOpen}
                endIcon={<ArrowDropDownIcon />}
                style={{
                  background: "#fff",
                  color: "#333",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontWeight: "600",
                  textTransform: "none",
                }}
              >
                Categories
              </Button>

              <Menu
                anchorEl={categoryAnchor}
                open={Boolean(categoryAnchor)}
                onClose={handleCategoryClose}
                MenuListProps={{ style: { display: "flex", padding: "20px", gap: "40px" } }}
              >
                <Box display="flex" gap="40px">
                  {/* Pathways Column */}
                  <Box display="flex" flexDirection="column">
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Pathways
                    </Typography>
                    <MenuItem onClick={() => goTo("/pathway/tech-skills")}>Tech Skills</MenuItem>
                    <MenuItem onClick={() => goTo("/pathway/analytical-skills")}>Analytical Skills</MenuItem>
                    <MenuItem onClick={() => goTo("/pathway/business-skills")}>Business Skills</MenuItem>
                  </Box>

                  {/* Courses Column */}
                  <Box display="flex" flexDirection="column">
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Individual Courses
                    </Typography>
                    <MenuItem onClick={() => goTo("/courses/coding")}>Coding</MenuItem>
                    <MenuItem onClick={() => goTo("/courses/devops")}>DevOps</MenuItem>
                    <MenuItem onClick={() => goTo("/courses/bigdata")}>Big Data</MenuItem>
                    <MenuItem onClick={() => goTo("/courses/powerbi")}>Power BI</MenuItem>
                    <MenuItem onClick={() => goTo("/courses/accounting")}>Accounting</MenuItem>
                    <MenuItem onClick={() => goTo("/courses/finance")}>Finance</MenuItem>
                  </Box>
                </Box>
              </Menu>
            </div>

            <input type="text" placeholder="Search..." style={styles.searchBar} />

            <div style={styles.profileContainer}>
              {isLoggedIn ? (
                <>
                  <Avatar onClick={handleMenuOpen} style={styles.avatar} />
                  <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                    <MenuItem onClick={() => navigate('/profilemanagement')}>
                      Edit Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <Link to="/login" style={styles.loginButton}>
                  <button style={styles.button}>Login/Signup</button>
                </Link>
              )}
            </div>
          </header>

          <nav style={styles.navBar}>
            <Link to="/" style={styles.navLink}>Home</Link>
            {!isLoggedIn && <Link to="/registration" style={styles.navLink}>Registration</Link>}
            {!isLoggedIn && <Link to="/login" style={styles.navLink}>Login</Link>}
            <Link to="/login2fa" style={styles.navLink}>Login 2FA</Link>
            <Link to="/forgotpassword" style={styles.navLink}>Forgot Password</Link>
            {isLoggedIn && <Link to="/profilemanagement" style={styles.navLink}>Profile Management</Link>}
            <Link to="/admin" style={styles.navLink}>Admin</Link>
            <Link to="/courseowner" style={styles.navLink}>Course Owner</Link>
          </nav>
        </>
      )}

      {/* Routes */}
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/login2fa" element={<Login2FA />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/profilemanagement" element={<ProfileManagement setIsLoggedIn={setIsLoggedIn} />} />

        {/* Pathway Routes */}
        <Route path="/pathway/tech-skills" element={<PathwayPage name="Tech Skills" />} />
        <Route path="/pathway/analytical-skills" element={<PathwayPage name="Analytical Skills" />} />
        <Route path="/pathway/business-skills" element={<PathwayPage name="Business Skills" />} />

        {/* Course Routes */}
        <Route path="/courses/coding" element={<CoursePage name="Coding" />} />
        <Route path="/courses/devops" element={<CoursePage name="DevOps" />} />
        <Route path="/courses/bigdata" element={<CoursePage name="Big Data" />} />
        <Route path="/courses/powerbi" element={<CoursePage name="Power BI" />} />
        <Route path="/courses/accounting" element={<CoursePage name="Accounting" />} />
        <Route path="/courses/finance" element={<CoursePage name="Finance" />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="pathways" element={<PathwaysPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="enrollments" element={<EnrollmentsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="users" element={<AdminUserManagement />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="course-approvals" element={<AdminCourseApproval />} />
        </Route>

        {/* Course Owner */}
        <Route path="/courseowner" element={<CourseOwnerLayout />}>
          <Route index element={<CourseManagement />} />
          <Route path="courses" element={<CourseManagement />} />
          <Route path="modules" element={<Placeholder title="Modules Page" />} />
          <Route path="quizzes" element={<Placeholder title="Quizzes Page" />} />
        </Route>
      </Routes>

      {/* Footer only on non-admin & non-courseOwner routes */}
      {!isAdminRoute && !isCourseOwnerRoute && (
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
      )}
    </div>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
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
  loginButton: { marginLeft: '20px' },
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
