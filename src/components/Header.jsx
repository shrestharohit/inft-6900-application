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
import PersonIcon from "@mui/icons-material/Person";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Images/logo.png";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import useUserApi from "../hooks/useUserApi";
import { dummyCourses, dummyPathways } from "../Pages/dummyData";
import useRoleAccess from "../hooks/useRoleAccess";
import useCourseApi from "../hooks/useCourseApi";
import usePathwayApi from "../hooks/usePathwayApi";

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
    updateUserField,
  } = useAuth();

  const { updateUserById } = useUserApi();
  const { isAdmin, isCourseOwner } = useRoleAccess();
  const [courses, setCourses] = useState([]);
  const [pathways, setPathways] = useState([]);

  const { fetchAllCourses } = useCourseApi();
  const { fetchAllPathways } = usePathwayApi();

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const [coursesList, pathwayList] = await Promise.all([
          fetchAllCourses(),
          fetchAllPathways(),
        ]);

        if (mounted) {
          setCourses(coursesList?.slice(0, 3) || []);
          setPathways(pathwayList.pathways?.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load modules", err);
        if (mounted) console.log("Failed to load modules.");
      }
    };
    loadData();
    return () => (mounted = false);
  }, [fetchAllCourses, fetchAllPathways]);

  // ✅ Sync notification state on mount / user change
  useEffect(() => {
    if (loggedInUser) {
      setNotificationsEnabled(
        typeof loggedInUser.notificationEnabled === "boolean"
          ? loggedInUser.notificationEnabled
          : true
      );
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

  // ✅ Refactored notification toggle
  const handleToggleNotifications = async () => {
    if (!loggedInUser) return;

    const newValue = !notificationsEnabled;

    // 1️⃣ Update local state immediately
    setNotificationsEnabled(newValue);

    // 2️⃣ Persist to localStorage via AuthContext
    updateUserField({ notificationEnabled: newValue });

    // 3️⃣ Update backend asynchronously
    try {
      await updateUserById({
        userID: loggedInUser.id,
        notificationEnabled: newValue,
      });
    } catch (err) {
      console.error("Failed to update notifications", err);
      // Rollback on failure
      setNotificationsEnabled(!newValue);
      updateUserField({ notificationEnabled: !newValue });
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
                Explore
              </Button>

              <Menu
                anchorEl={categoryAnchor}
                open={Boolean(categoryAnchor)}
                onClose={handleCategoryClose}
                disableScrollLock={true}
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
                  {pathways.map((pathway) => (
                    <MenuItem
                      key={pathway.id}
                      onClick={() => goTo(`/pathway/${pathway.pathwayID}`)}
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
                  {courses.map((course) => (
                    <MenuItem
                      key={course.id}
                      onClick={() => goTo(`/courses/${course.courseID}`)}
                    >
                      {course.title}
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
                {/* ✅ Avatar + Logged-in user's name */}
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={handleMenuOpen}
                >
                <Avatar
                alt="User Avatar"
                sx={{ bgcolor: "white", color: "black" }}
                >
                <PersonIcon />  
                </Avatar>

                  <Typography
                    variant="body1"
                    sx={{ color: "white", fontWeight: 600 }}
                  >
                    {`${loggedInUser?.firstName || ""} ${
                      loggedInUser?.lastName || ""
                    }`.trim() || "Logged User"}
                  </Typography>
                </div>

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  disableScrollLock={true}
                >
                  <MenuItem onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/profilemanagement")}>
                    Edit Profile
                  </MenuItem>
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

                  {/* Admin / Course Owner */}
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
