// src/Pages/Admin/AdminLayout.jsx
import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Switch,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Dashboard,
  School,
  LibraryBooks,
  People,
  Mail,
  Settings,
  ExitToApp,
  Quiz,
  AccountCircle,
  NotificationsActive,
  Rule,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import useUserApi from "../../hooks/useUserApi";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/admin", icon: <Dashboard /> },
  { label: "Users", to: "/admin/users", icon: <People /> },
  
  {
    label: "Course Approvals",
    to: "/admin/course-approvals",
    icon: <LibraryBooks />,
  },
  { label: "Profile", to: "/admin/profile", icon: <Settings /> },
  // { label: "Quiz Approvals", to: "/admin/quiz-approvals", icon: <Quiz /> },
];

export default function AdminLayout() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { clearUserDataFromState, loggedInUser } = useAuth();

  // Notification toggle state (bootstrap from user if available)
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const { updateUserById } = useUserApi();
  const { setUserDataInState } = useAuth();

  React.useEffect(() => {
    if (loggedInUser?.notificationEnabled != null) {
      setNotificationsEnabled(!!loggedInUser.notificationEnabled);
    }
  }, [loggedInUser]);

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
      if (updatedUser) setUserDataInState(updatedUser, false);
    } catch (err) {
      console.error("Failed to update notifications", err);
      setNotificationsEnabled((prev) => !prev);
    }
  };

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleEditProfile = () => {
    handleMenuClose();
    navigate("/admin/profile");
  };

  const handleGoCourseApprovals = () => {
    handleMenuClose();
    navigate("/admin/course-approvals");
  };

  const handleGoQuizApprovals = () => {
    handleMenuClose();
    navigate("/admin/quiz-approvals");
  };

  const handleLogout = () => {
    handleMenuClose();
    clearUserDataFromState();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar (unchanged) */}
      <aside className="fixed top-0 left-0 bottom-0 w-60 bg-gray-900 text-gray-200 flex flex-col border-r border-white/10">
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <span className="font-bold tracking-wide text-white">
            BrainWave Admin
          </span>
        </div>

        <nav className="flex-1 p-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-gray-700 text-white"
                    : "hover:bg-gray-800 hover:text-white text-gray-300"
                }`
              }
            >
              <span className="text-gray-400">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-60 flex-1 p-6">
        {/* Top-right controls */}
        <div className="sticky top-4 flex justify-end mb-4 z-20">
          <Tooltip title="Account">
            <Avatar
              onClick={handleMenuOpen}
              sx={{
                cursor: "pointer",
                bgcolor: "#e0e0e0",
                color: "#616161",
                width: 40,
                height: 40,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            />
          </Tooltip>

          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            {/* Profile quick link */}
            <MenuItem onClick={handleEditProfile}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Edit Profile" />
            </MenuItem>

            {/* Notifications toggle */}
            <MenuItem disableRipple>
              <ListItemIcon>
                <NotificationsActive fontSize="small" />
              </ListItemIcon>
              <div className="flex items-center justify-between w-full">
                <span>Notifications</span>
                <Switch
                  checked={notificationsEnabled}
                  onChange={handleToggleNotifications}
                  color="success"
                />
              </div>
            </MenuItem>

            <Divider />

            {/* Logout */}
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </div>

        {/* Routed admin pages */}
        <Outlet />
      </main>
    </div>
  );
}
