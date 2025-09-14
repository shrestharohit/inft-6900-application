import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Avatar, Menu, MenuItem, Tooltip } from "@mui/material";
import {
    Dashboard,
    LibraryBooks,
    ViewModule,
    Quiz,
    BarChart,
    Settings,
    ExitToApp
} from "@mui/icons-material";

const NAV_ITEMS = [
    { label: "Dashboard", to: "/courseowner", icon: <Dashboard /> },
    { label: "Courses", to: "/courseowner/courses", icon: <LibraryBooks /> },
    { label: "Modules", to: "/courseowner/modules", icon: <ViewModule /> },
    { label: "Quizzes", to: "/courseowner/quizzes", icon: <Quiz /> },
    { label: "Reports", to: "/courseowner/reports", icon: <BarChart /> },
    { label: "Settings", to: "/courseowner/settings", icon: <Settings /> },
];

const SIDEBAR_WIDTH = 240;

export default function CourseOwnerLayout() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleEditProfile = () => {
        handleMenuClose();
        navigate("/profilemanagement");
    };

    const handleLogout = () => {
        handleMenuClose();
        localStorage.removeItem("userToken");
        sessionStorage.removeItem("userToken");
        navigate("/");
    };

    return (
        <div style={styles.shell}>
            {/* Sticky / fixed sidebar */}
            <aside style={styles.sidebar}>
                <div style={styles.brand}>
                    <div style={styles.brandText}>BrainWave Course Owner</div>
                </div>

                <nav style={styles.nav}>
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end
                            style={({ isActive }) => ({
                                ...styles.navItem,
                                backgroundColor: isActive ? "#2d3748" : "transparent",
                            })}
                        >
                            <span style={styles.icon}>{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main content (shifted right to account for fixed sidebar) */}
            <main style={styles.content}>
                {/* Floating top-right profile avatar */}
                <div style={styles.topRightControls}>
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
                        <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <ExitToApp fontSize="small" style={{ marginRight: 8 }} />
                            Logout
                        </MenuItem>
                    </Menu>
                </div>

                {/* Routed course owner pages go here */}
                <Outlet />
            </main>
        </div>
    );
}

const styles = {
    shell: {
        minHeight: "100vh",
        background: "#f7fafc",
    },
    sidebar: {
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: SIDEBAR_WIDTH,
        backgroundColor: "#1a202c",
        color: "#e2e8f0",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(255,255,255,0.06)",
    },
    brand: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "18px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
    },
    brandText: {
        fontWeight: 700,
        letterSpacing: "0.2px",
        color: "#fff",
    },
    nav: {
        flex: 1,
        padding: "8px 6px",
        overflowY: "auto",
    },
    navItem: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        margin: "4px 6px",
        textDecoration: "none",
        color: "#e2e8f0",
        borderRadius: 8,
        transition: "background 0.15s ease",
    },
    icon: {
        display: "inline-flex",
        alignItems: "center",
        color: "#a0aec0",
        width: 22,
    },
    content: {
        marginLeft: SIDEBAR_WIDTH,
        padding: "24px",
        minHeight: "100vh",
    },
    topRightControls: {
        position: "sticky",
        top: 16,
        display: "flex",
        justifyContent: "flex-end",
        zIndex: 2,
        marginBottom: 16,
    },
};
