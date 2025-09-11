import React from "react";
import { Paper, Typography } from "@mui/material";

export const Placeholder = ({ title }) => (
    <Paper sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={700}>{title}</Typography>
        <Typography sx={{ mt: 1, color: "text.secondary" }}>
            Coming soon…
        </Typography>
    </Paper>
);

export const DashboardPage = () => <Placeholder title="Dashboard" />;
export const PathwaysPage = () => <Placeholder title="Pathways" />;
export const CoursesPage = () => <Placeholder title="Courses" />;
export const EnrollmentsPage = () => <Placeholder title="Enrollments" />;
export const ReportsPage = () => <Placeholder title="Reports" />;
export const MessagesPage = () => <Placeholder title="Messages" />;
export const SettingsPage = () => <Placeholder title="Settings" />;
