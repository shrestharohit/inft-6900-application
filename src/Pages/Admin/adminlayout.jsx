import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Avatar, Menu, MenuItem, Tooltip } from "@mui/material";
import {
    Dashboard,
    School,
    LibraryBooks,
    People,
    Mail,
    Settings,
    ExitToApp,
    Quiz,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";

const NAV_ITEMS = [
    { label: "Dashboard", to: "/admin", icon: <Dashboard /> },
    { label: "Courses", to: "/admin/courses", icon: <LibraryBooks /> },
    { label: "Enrollments", to: "/admin/enrollments", icon: <School /> },
    { label: "Users", to: "/admin/users", icon: <People /> },
    { label: "Messages", to: "/admin/messages", icon: <Mail /> },
    { label: "Profile", to: "/admin/profile", icon: <Settings /> }, // 🔄 updated
    { label: "Course Approvals", to: "/admin/course-approvals", icon: <LibraryBooks /> },
    { label: "Module Approvals", to: "/admin/module-approvals", icon: <School /> },
    { label: "Quiz Approvals", to: "/admin/quiz-approvals", icon: <Quiz /> },
    { label: "Pathways Approvals", to: "/admin/pathways", icon: <LibraryBooks /> },
];

export default function AdminLayout() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const { clearUserDataFromState } = useAuth();

    const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = () => {
        handleMenuClose();
        clearUserDataFromState();
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="fixed top-0 left-0 bottom-0 w-60 bg-gray-900 text-gray-200 flex flex-col border-r border-white/10">
                {/* Brand */}
                <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
                    <span className="font-bold tracking-wide text-white">
                        BrainWave Admin
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-2 overflow-y-auto">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${isActive
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
                        <MenuItem onClick={handleLogout}>
                            <ExitToApp fontSize="small" className="mr-2" />
                            Logout
                        </MenuItem>
                    </Menu>
                </div>

                {/* Routed admin pages */}
                <Outlet />
            </main>
        </div>
    );
}
