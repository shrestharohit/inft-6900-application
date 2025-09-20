import { Avatar, Menu, MenuItem, Button, Box, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link, useNavigate } from "react-router-dom";

// Import the logo image
import logo from "../assets/Images/logo.png";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [categoryAnchor, setCategoryAnchor] = useState(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();
  const { isLoggedIn, clearUserID } = useAuth();

  // Navigation menu items
  const navItems = [
    { path: "/", label: "Home", showAlways: true },
    { path: "/registration", label: "Registration", showWhenLoggedOut: true },
    { path: "/login", label: "Login", showWhenLoggedOut: true },
    { path: "/login2fa", label: "Login 2FA", showAlways: true },
    { path: "/forgotpassword", label: "Forgot Password", showAlways: true },
    {
      path: "/profilemanagement",
      label: "Profile Management",
      showWhenLoggedIn: true,
    },
    { path: "/admin", label: "Admin", showAlways: true },
    { path: "/courseowner", label: "Course Owner", showAlways: true },
  ];

  // Category menu items
  const categoryMenuItems = {
    pathways: {
      title: "Pathways",
      items: [
        { path: "/pathway/tech-skills", label: "Tech Skills" },
        { path: "/pathway/analytical-skills", label: "Analytical Skills" },
        { path: "/pathway/business-skills", label: "Business Skills" },
      ],
    },
    courses: {
      title: "Individual Courses",
      items: [
        { path: "/courses/coding", label: "Coding" },
        { path: "/courses/devops", label: "DevOps" },
        { path: "/courses/bigdata", label: "Big Data" },
        { path: "/courses/powerbi", label: "Power BI" },
        { path: "/courses/accounting", label: "Accounting" },
        { path: "/courses/finance", label: "Finance" },
      ],
    },
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    setAnchorEl(null);
    navigate("/");
    clearUserID();
  };

  const handleCategoryOpen = (event) => setCategoryAnchor(event.currentTarget);
  const handleCategoryClose = () => setCategoryAnchor(null);
  const goTo = (path) => {
    navigate(path);
    handleCategoryClose();
  };

  return (
    <>
      <header className="flex justify-between items-center px-2.5 py-1.5 bg-green-500 text-white h-20">
        <div className="container mx-auto flex justify-between items-center max-w-6xl">
          <div className="flex items-center text-3xl font-bold">
            <Link to="/">
              <img
                src={logo}
                alt="BrainWave Logo"
                className="w-48 h-32 mr-2.5 cursor-pointer"
              />
            </Link>
          </div>

          <div className="flex items-center cursor-pointer">
            {isLoggedIn ? (
              <>
                <Avatar
                  onClick={handleMenuOpen}
                  className="cursor-pointer w-10 h-10 bg-white border border-gray-300"
                />
                <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                  <MenuItem onClick={() => navigate("/profilemanagement")}>
                    Edit Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Link to="/login" className="ml-5">
                <button className="px-5 py-2.5 text-base bg-red-600 text-white border-none rounded cursor-pointer hover:bg-red-700 transition-colors">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 py-0">
        <div className="container mx-auto max-w-6xl flex justify-center items-center">
          {navItems.map((item) => {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="text-white no-underline px-5 py-2 mx-2.5 text-base font-bold rounded hover:bg-gray-700 transition-colors"
              >
                {item.label}
              </Link>
            );
          })}

          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={handleCategoryOpen}
              className="text-white no-underline px-5 py-2 mx-2.5 text-base font-bold rounded hover:bg-gray-700 transition-colors flex items-center bg-transparent border-none cursor-pointer"
            >
              Categories
              <ArrowDropDownIcon className="ml-1" />
            </button>

            <Menu
              anchorEl={categoryAnchor}
              open={Boolean(categoryAnchor)}
              onClose={handleCategoryClose}
            >
              <Box display="flex" gap="40px">
                {Object.entries(categoryMenuItems).map(([key, category]) => (
                  <Box key={key} display="flex" flexDirection="column">
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {category.title}
                    </Typography>
                    {category.items.map((item) => (
                      <MenuItem key={item.path} onClick={() => goTo(item.path)}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Box>
                ))}
              </Box>
            </Menu>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
