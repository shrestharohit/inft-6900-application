import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Avatar, Menu, MenuItem, Tooltip, Badge } from "@mui/material";
import {
    Dashboard,
    LibraryBooks,
    ViewModule,
    Quiz,
    QuestionAnswer,
    BarChart,
    Settings,
    ExitToApp,
} from "@mui/icons-material";

const NAV_ITEMS = [
    { label: "Dashboard", to: "/courseowner", icon: <Dashboard /> },
    { label: "Courses", to: "/courseowner/courses", icon: <LibraryBooks /> },
    { label: "Modules", to: "/courseowner/modules", icon: <ViewModule /> },
    { label: "Quizzes", to: "/courseowner/quizzes", icon: <Quiz /> },
    { label: "Announcements", to: "/courseowner/announcements", icon: <LibraryBooks /> },
    { label: "Discussions", to: "/courseowner/discussions", icon: <BarChart /> },
    { label: "Questions", to: "/courseowner/questions", icon: <QuestionAnswer /> }, // ✅ badge target
    { label: "Profile", to: "/courseowner/profile", icon: <Settings /> },
];

export default function CourseOwnerLayout() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    // ✅ Load unanswered questions count from localStorage
    const unansweredCount = React.useMemo(() => {
        let total = 0;
        // loop through all courses in localStorage
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("questions_")) {
                const questions = JSON.parse(localStorage.getItem(key)) || [];
                const pending = questions.filter((q) => !q.reply).length;
                total += pending;
            }
        });
        return total;
    }, []);

    const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleEditProfile = () => {
        handleMenuClose();
        navigate("/courseowner/profile");
    };

    const handleLogout = () => {
        handleMenuClose();
        localStorage.removeItem("userToken");
        sessionStorage.removeItem("userToken");
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="fixed top-0 left-0 bottom-0 w-60 bg-gray-900 text-gray-200 flex flex-col border-r border-white/10">
                {/* Brand */}
                <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
                    <span className="font-bold tracking-wide text-white">
                        BrainWave Course Owner
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-2 overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const isQuestions = item.label === "Questions";
                        return (
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
                                {/* If it's Questions, wrap icon with Badge */}
                                {isQuestions && unansweredCount > 0 ? (
                                    <Badge
                                        badgeContent={unansweredCount}
                                        color="error"
                                        overlap="circular"
                                    >
                                        <span className="text-gray-400">{item.icon}</span>
                                    </Badge>
                                ) : (
                                    <span className="text-gray-400">{item.icon}</span>
                                )}
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
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
                        <MenuItem onClick={handleEditProfile}>
                            <Settings fontSize="small" className="mr-2" />
                            Profile
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <ExitToApp fontSize="small" className="mr-2" />
                            Logout
                        </MenuItem>
                    </Menu>
                </div>

                {/* Routed course owner pages */}
                <Outlet />
            </main>
        </div>
    );
}
