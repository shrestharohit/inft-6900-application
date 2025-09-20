import { Avatar, Menu, MenuItem, Button, Box, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Import the logo image
import logo from "../assets/Images/logo.png";
import { useEffect, useState } from "react";

const Header = () => {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isCourseOwnerRoute = location.pathname.startsWith("/courseowner");

  const [anchorEl, setAnchorEl] = useState(null);
  const [categoryAnchor, setCategoryAnchor] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  // Check authentication status on mount and route change
  useEffect(() => {
    const token =
      localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
    setIsLoggedIn(!!token);
    console.log("🔑 Login state:", !!token);
  }, []);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    sessionStorage.removeItem("userToken");
    setIsLoggedIn(false);
    setAnchorEl(null);
    navigate("/");
  };

  const handleCategoryOpen = (event) => setCategoryAnchor(event.currentTarget);
  // Category dropdown
  const handleCategoryClose = () => setCategoryAnchor(null);
  const goTo = (path) => {
    navigate(path);
    handleCategoryClose();
  };

  return (
    <>
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
                MenuListProps={{
                  style: { display: "flex", padding: "20px", gap: "40px" },
                }}
              >
                <Box display="flex" gap="40px">
                  {/* Pathways Column */}
                  <Box display="flex" flexDirection="column">
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      Pathways
                    </Typography>
                    <MenuItem onClick={() => goTo("/pathway/tech-skills")}>
                      Tech Skills
                    </MenuItem>
                    <MenuItem
                      onClick={() => goTo("/pathway/analytical-skills")}
                    >
                      Analytical Skills
                    </MenuItem>
                    <MenuItem onClick={() => goTo("/pathway/business-skills")}>
                      Business Skills
                    </MenuItem>
                  </Box>

                  {/* Courses Column */}
                  <Box display="flex" flexDirection="column">
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      Individual Courses
                    </Typography>
                    <MenuItem onClick={() => goTo("/courses/coding")}>
                      Coding
                    </MenuItem>
                    <MenuItem onClick={() => goTo("/courses/devops")}>
                      DevOps
                    </MenuItem>
                    <MenuItem onClick={() => goTo("/courses/bigdata")}>
                      Big Data
                    </MenuItem>
                    <MenuItem onClick={() => goTo("/courses/powerbi")}>
                      Power BI
                    </MenuItem>
                    <MenuItem onClick={() => goTo("/courses/accounting")}>
                      Accounting
                    </MenuItem>
                    <MenuItem onClick={() => goTo("/courses/finance")}>
                      Finance
                    </MenuItem>
                  </Box>
                </Box>
              </Menu>
            </div>

            <div style={styles.profileContainer}>
              {isLoggedIn ? (
                <>
                  <Avatar onClick={handleMenuOpen} style={styles.avatar} />
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => navigate("/profilemanagement")}>
                      Edit Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <Link to="/login" style={styles.loginButton}>
                  <button className="bg-gray-100 text-blue-600">
                    Login/Signup
                  </button>
                </Link>
              )}
            </div>
          </header>
          {/* Navigation */}
          <nav style={styles.navBar}>
            <Link to="/" style={styles.navLink}>
              Home
            </Link>
            {!isLoggedIn && (
              <Link to="/registration" style={styles.navLink}>
                Registration
              </Link>
            )}
            {!isLoggedIn && (
              <Link to="/login" style={styles.navLink}>
                Login
              </Link>
            )}
            <Link to="/login2fa" style={styles.navLink}>
              Login 2FA
            </Link>
            <Link to="/forgotpassword" style={styles.navLink}>
              Forgot Password
            </Link>
            {isLoggedIn && (
              <Link to="/profilemanagement" style={styles.navLink}>
                Profile Management
              </Link>
            )}
            <Link to="/admin" style={styles.navLink}>
              Admin
            </Link>
            <Link to="/courseowner" style={styles.navLink}>
              Course Owner
            </Link>
          </nav>
        </>
      )}
    </>
  );
};

const styles = {
  appContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5px 10px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    height: "80px",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    fontSize: "30px",
    fontWeight: "bold",
  },
  logoImage: {
    width: "200px",
    height: "140px",
    marginRight: "10px",
    cursor: "pointer",
  },
  searchBar: {
    padding: "8px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    width: "40%",
    margin: "0 auto",
  },
  profileContainer: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  avatar: {
    cursor: "pointer",
    width: "40px",
    height: "40px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
  },
  loginButton: { marginLeft: "20px" },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#db4437",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  navBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
    padding: "0px",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    padding: "8px 20px",
    margin: "0 10px",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "4px",
  },
  footer: {
    backgroundColor: "#333",
    color: "#fff",
    padding: "20px 0",
    textAlign: "center",
    marginTop: "auto",
  },
  footerLinks: { display: "flex", justifyContent: "center", gap: "20px" },
  footerLink: { color: "#fff", textDecoration: "none", fontSize: "16px" },
  footerText: { marginTop: "10px", fontSize: "14px", color: "#ccc" },
};
export default Header;
