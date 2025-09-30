// src/components/Header.jsx
import { Avatar, Menu, MenuItem, Button, Box, Typography, Divider } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Images/logo.png";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { dummyCourses, dummyPathways } from "../Pages/dummyData"; // ✅ central data

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [categoryAnchor, setCategoryAnchor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");

  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { isLoggedIn, clearUserDataFromState } = useAuth();

  const getPlaceholder = () => {
    switch (searchCategory) {
      case "courses":
        return "Search courses...";
      case "pathways":
        return "Search pathways...";
      default:
        return "Search courses or pathways...";
    }
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    setAnchorEl(null);
    navigate("/");
    clearUserDataFromState();
  };

  const handleCategoryOpen = (event) => setCategoryAnchor(event.currentTarget);
  const handleCategoryClose = () => setCategoryAnchor(null);

  const goTo = (path) => {
    navigate(path);
    handleCategoryClose();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(
        `/search?query=${encodeURIComponent(searchQuery)}&category=${searchCategory}`
      );
      setSearchQuery("");
    }
  };

  return (
    // <header className="flex justify-between items-center px-6 py-3 bg-green-500 text-white h-20">
    //   <div className="container mx-auto flex justify-between items-center max-w-7xl">

    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-3 bg-green-500 text-white h-20 shadow-md">
      <div className="container mx-auto flex justify-between items-center max-w-7xl">
        {/* Logo + Categories */}
        <div className="flex items-center space-x-6">
          <Link to="/">
            <img
              src={logo}
              alt="BrainWave Logo"
              className="w-40 h-28 cursor-pointer"
            />
          </Link>

          {/* Categories Dropdown */}
          <div>
            <Button
              onClick={handleCategoryOpen}
              endIcon={<ArrowDropDownIcon />}
              sx={{
                background: "#fff",
                color: "#333",
                px: 2,
                py: 1,
                borderRadius: "6px",
                fontWeight: 600,
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
                sx: { display: "flex", gap: "40px", px: 2, py: 2 },
              }}
            >
              {/* Pathways */}
              <Box display="flex" flexDirection="column" mr={4}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Pathways
                </Typography>
                {dummyPathways.map((pathway) => (
                  <MenuItem
                    key={pathway.id}
                    onClick={() => goTo(`/pathway/${pathway.id}`)}
                  >
                    {pathway.name}
                  </MenuItem>
                ))}
                <Divider sx={{ my: 1 }} />
                <MenuItem onClick={() => goTo("/all-pathways")}>
                  View All Pathways →
                </MenuItem>
              </Box>

              {/* Courses */}
              <Box display="flex" flexDirection="column">
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Individual Courses
                </Typography>
                {dummyCourses.map((course) => (
                  <MenuItem
                    key={course.id}
                    onClick={() => goTo(`/courses/${course.id}`)}
                  >
                    {course.name}
                  </MenuItem>
                ))}
                <Divider sx={{ my: 1 }} />
                <MenuItem onClick={() => goTo("/all-courses")}>
                  View All Courses →
                </MenuItem>
              </Box>
            </Menu>
          </div>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex-1 mx-12 max-w-2xl flex items-center bg-white rounded-full overflow-hidden shadow-md"
        >
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="px-3 py-2 text-gray-700 border-r focus:outline-none"
          >
            <option value="all">All</option>
            <option value="courses">Courses</option>
            <option value="pathways">Pathways</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getPlaceholder()}
            className="px-4 py-2 flex-1 text-black focus:outline-none"
          />
          <button
            type="submit"
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 text-white transition"
          >
            <SearchIcon />
          </button>
        </form>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Avatar
                onClick={handleMenuOpen}
                sx={{
                  cursor: "pointer",
                  width: 40,
                  height: 40,
                  bgcolor: "white",
                  color: "black",
                }}
              />
              <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem onClick={() => navigate("/dashboard")}>
                  Dashboard
                </MenuItem>
                <MenuItem onClick={() => navigate("/profilemanagement")}>
                  Edit Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>

              </Menu>
            </>
          ) : (
            <Link to="/login">
              <button className="inline-block bg-gradient-to-r from-[#1f2a60] to-[#4856a6] text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-[#174bcc] my-8">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
