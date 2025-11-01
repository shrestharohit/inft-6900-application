// // src/components/Header.jsx
// import { Avatar, Menu, MenuItem, Button, Box, Typography, Divider, Switch, FormControlLabel } from "@mui/material";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// import SearchIcon from "@mui/icons-material/Search";
// import { Link, useNavigate } from "react-router-dom";
// import logo from "../assets/Images/logo.png";
// import { useState } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import { dummyCourses, dummyPathways } from "../Pages/dummyData"; // ✅ central data

// const Header = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [categoryAnchor, setCategoryAnchor] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchCategory, setSearchCategory] = useState("all");
//   const [notificationsEnabled, setNotificationsEnabled] = useState(false); // notification state

//   const open = Boolean(anchorEl);
//   const navigate = useNavigate();
//   const { isLoggedIn, clearUserDataFromState, loggedInUser, setUserDataInState, updateUser } = useAuth();

//   // Load initial notification state if logged in
//   useState(() => {
//     if (loggedInUser) {
//       setNotificationsEnabled(loggedInUser.notificationsEnabled || false);
//     }
//   });

//   const getPlaceholder = () => {
//     switch (searchCategory) {
//       case "courses":
//         return "Search courses...";
//       case "pathways":
//         return "Search pathways...";
//       default:
//         return "Search courses or pathways...";
//     }
//   };

//   const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
//   const handleMenuClose = () => setAnchorEl(null);

//   const handleLogout = () => {
//     setAnchorEl(null);
//     navigate("/");
//     clearUserDataFromState();
//   };

//   const handleCategoryOpen = (event) => setCategoryAnchor(event.currentTarget);
//   const handleCategoryClose = () => setCategoryAnchor(null);

//   const goTo = (path) => {
//     navigate(path);
//     handleCategoryClose();
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(
//         `/search?query=${encodeURIComponent(searchQuery)}&category=${searchCategory}`
//       );
//       setSearchQuery("");
//     }
//   };

//   const handleToggleNotifications = async () => {
//     const newValue = !notificationsEnabled;
//     setNotificationsEnabled(newValue);

//     // Optionally, save this to the server if you have updateUser API
//     if (loggedInUser) {
//       try {
//         const updatedUser = await updateUser(loggedInUser.id, { notificationsEnabled: newValue });
//         setUserDataInState(updatedUser);
//       } catch (err) {
//         console.error("Failed to update notifications", err);
//       }
//     }
//   };

//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-3 bg-green-500 text-white h-20 shadow-md">
//       <div className="container mx-auto flex justify-between items-center max-w-7xl">
//         {/* Logo + Categories */}
//         <div className="flex items-center space-x-6">
//           <Link to="/">
//             <img
//               src={logo}
//               alt="BrainWave Logo"
//               className="w-40 h-28 cursor-pointer"
//             />
//           </Link>

//           {/* Categories Dropdown */}
//           <div>
//             <Button
//               onClick={handleCategoryOpen}
//               endIcon={<ArrowDropDownIcon />}
//               sx={{
//                 background: "#fff",
//                 color: "#333",
//                 px: 2,
//                 py: 1,
//                 borderRadius: "6px",
//                 fontWeight: 600,
//                 textTransform: "none",
//               }}
//             >
//               Categories
//             </Button>

//             <Menu
//               anchorEl={categoryAnchor}
//               open={Boolean(categoryAnchor)}
//               onClose={handleCategoryClose}
//               MenuListProps={{
//                 sx: { display: "flex", gap: "40px", px: 2, py: 2 },
//               }}
//             >
//               {/* Pathways */}
//               <Box display="flex" flexDirection="column" mr={4}>
//                 <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
//                   Pathways
//                 </Typography>
//                 {dummyPathways.map((pathway) => (
//                   <MenuItem
//                     key={pathway.id}
//                     onClick={() => goTo(`/pathway/${pathway.id}`)}
//                   >
//                     {pathway.name}
//                   </MenuItem>
//                 ))}
//                 <Divider sx={{ my: 1 }} />
//                 <MenuItem onClick={() => goTo("/all-pathways")}>
//                   View All Pathways →
//                 </MenuItem>
//               </Box>

//               {/* Courses */}
//               <Box display="flex" flexDirection="column">
//                 <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
//                   Individual Courses
//                 </Typography>
//                 {dummyCourses.map((course) => (
//                   <MenuItem
//                     key={course.id}
//                     onClick={() => goTo(`/courses/${course.id}`)}
//                   >
//                     {course.name}
//                   </MenuItem>
//                 ))}
//                 <Divider sx={{ my: 1 }} />
//                 <MenuItem onClick={() => goTo("/all-courses")}>
//                   View All Courses →
//                 </MenuItem>
//               </Box>
//             </Menu>
//           </div>
//         </div>

//         {/* Search */}
//         <form
//           onSubmit={handleSearch}
//           className="flex-1 mx-12 max-w-2xl flex items-center bg-white rounded-full overflow-hidden shadow-md"
//         >
//           <select
//             value={searchCategory}
//             onChange={(e) => setSearchCategory(e.target.value)}
//             className="px-3 py-2 text-gray-700 border-r focus:outline-none"
//           >
//             <option value="all">All</option>
//             <option value="courses">Courses</option>
//             <option value="pathways">Pathways</option>
//           </select>
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder={getPlaceholder()}
//             className="px-4 py-2 flex-1 text-black focus:outline-none"
//           />
//           <button
//             type="submit"
//             className="bg-gray-700 hover:bg-gray-600 px-4 py-2 text-white transition"
//           >
//             <SearchIcon />
//           </button>
//         </form>

//         {/* User Section */}
//         <div className="flex items-center space-x-4">
//           {isLoggedIn ? (
//             <>
//               <Avatar
//                 onClick={handleMenuOpen}
//                 sx={{
//                   cursor: "pointer",
//                   width: 40,
//                   height: 40,
//                   bgcolor: "white",
//                   color: "black",
//                 }}
//               />
//               <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
//                 <MenuItem onClick={() => navigate("/dashboard")}>
//                   Dashboard
//                 </MenuItem>
//                 <MenuItem onClick={() => navigate("/profilemanagement")}>
//                   Edit Profile
//                 </MenuItem>

//                 {/* Notification Toggle */}
//                 <MenuItem>
//                   <div className="flex justify-between items-center w-full">
//                   <span>Notifications</span>
//                   <Switch
//                     checked={notificationsEnabled}
//                     onChange={handleToggleNotifications}
//                     color="success"
//                   />
//                   </div>
//                 </MenuItem>

//                 <MenuItem onClick={handleLogout}>Logout</MenuItem>
//               </Menu>
//             </>
//           ) : (
//             <Link to="/login">
//               <button className="inline-block bg-gradient-to-r from-[#1f2a60] to-[#4856a6] text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-[#174bcc] my-8">
//                 Login
//               </button>
//             </Link>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import {
  Avatar,
  Menu,
  MenuItem,
  Button,
  Box,
  Typography,
  Divider,
  Switch,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Images/logo.png";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import useUserApi from "../hooks/useUserApi";
import { dummyCourses, dummyPathways } from "../Pages/dummyData";
import useRoleAccess from "../hooks/useRoleAccess"; // ✅ Role detection hook

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [categoryAnchor, setCategoryAnchor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const {
    isLoggedIn,
    clearUserDataFromState,
    loggedInUser,
    setUserDataInState,
  } = useAuth();
  const { updateUserById } = useUserApi();

  // ✅ Roles
  const { isAdmin, isCourseOwner } = useRoleAccess();

  useEffect(() => {
    if (loggedInUser) {
      setNotificationsEnabled(!!loggedInUser.notificationEnabled); // Override default based on logged-in user
    }
  }, [loggedInUser]);

  
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
        `/search?query=${encodeURIComponent(
          searchQuery
        )}&category=${searchCategory}`
      );
      setSearchQuery("");
    }
  };

  const handleToggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    if (!loggedInUser) return;

    try {
      const response = await updateUserById({
        userID: loggedInUser.id,
        notificationEnabled: newValue,
      });
      const updatedUser = response?.user || response;
      if (updatedUser) setUserDataInState(updatedUser);
    } catch (err) {
      console.error("Failed to update notifications", err);
      setNotificationsEnabled((prev) => !prev);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-green-500 text-white shadow-md">
      <div className="container mx-auto max-w-7xl px-6 py-3">
        <div className="flex justify-between items-center gap-4">
          {/* Logo + Categories */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="BrainWave"
                style={{ height: "80px", width: "auto", objectFit: "contain" }}
              />
            </Link>

            {/* Categories Dropdown */}
            <div>
              <Button
                onClick={handleCategoryOpen}
                endIcon={<ArrowDropDownIcon />}
                size="small"
                sx={{
                  background: "#fff",
                  color: "#333",
                  px: 2,
                  borderRadius: "9999px",
                  fontWeight: 600,
                  textTransform: "none",
                  height: 40,
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
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
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
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
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
            className="flex-1 mx-4 max-w-2xl flex items-center bg-white rounded-full overflow-hidden shadow-md h-10 md:h-12"
          >
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="px-3 h-full text-gray-700 border-r focus:outline-none"
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
              className="px-4 h-full flex-1 text-black focus:outline-none"
            />
            <button
              type="submit"
              className="bg-gray-700 hover:bg-gray-600 px-4 h-full text-white transition"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
          </form>

          {/* User Section */}
          <div className="flex items-center gap-4">
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

                  {/* 🕒 Pomodoro Settings */}
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate("/pomodoro-settings");
                    }}
                  >
                    Pomodoro Settings
                  </MenuItem>

                  <Divider />

                  {/* Notifications Toggle */}
                  <MenuItem>
                    <div className="flex justify-between items-center w-full">
                      <span>Notifications</span>
                      <Switch
                        checked={notificationsEnabled}
                        onChange={handleToggleNotifications}
                        color="success"
                      />
                    </div>
                  </MenuItem>

                  {/* ✅ Admin / Course Owner Portals moved here */}
                  {isAdmin && (
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate("/admin/");
                      }}
                    >
                      Admin Portal
                    </MenuItem>
                  )}

                  {isCourseOwner && (
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate("/course-management");
                      }}
                    >
                      Course Owner Portal
                    </MenuItem>
                  )}

                  <Divider />

                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Link to="/login">
                <button className="inline-block bg-gradient-to-r from-[#1f2a60] to-[#4856a6] text-white px-6 py-2 md:py-3 rounded-lg font-bold shadow-lg hover:bg-[#174bcc]">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
