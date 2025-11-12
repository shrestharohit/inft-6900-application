import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Table, TableHead, TableRow, TableCell, TableBody,
    Button,
    Tooltip,
    Snackbar,
    Alert
} from "@mui/material";

const STORAGE_KEY = "course_owner_modules"; 

const AdminModuleApproval = () => {
    const [modules, setModules] = useState([]);
    const [snack, setSnack] = useState({ open: false, severity: "success", msg: "" });

    // Load modules
    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                setModules(JSON.parse(raw));
            } catch {
                setModules([]);
            }
        }
    }, []);

    // Sync back
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(modules));
    }, [modules]);

    const updateStatus = (idx, status) => {
        const next = [...modules];
        next[idx].status = status;
        setModules(next);

        let msg = "";
        if (status === "Active") msg = "Module approved and activated.";
        if (status === "Draft") msg = "Module declined and moved to draft.";
        if (status === "Inactive") msg = "Module deactivated.";
        if (status === "Request for Approval") msg = "Module sent for approval.";
        setSnack({ open: true, severity: "info", msg });
    };

    return (
        <Box sx={styles.page}>
            <Box sx={styles.card}>
                <Typography variant="h5" fontWeight={700} mb={2}>
                    Module Approval
                </Typography>

                <Paper variant="outlined">
                    <Table>
                        <TableHead sx={{ background: "#f7f7f9" }}>
                            <TableRow>
                                <TableCell>Course</TableCell>
                                <TableCell>Module</TableCell>
                                <TableCell>Pages</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {modules.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                                        No modules submitted yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                modules.map((m, idx) => (
                                    <TableRow key={idx} hover>
                                        <TableCell>{m.courseName}</TableCell>
                                        <TableCell>{m.moduleTitle}</TableCell>
                                        <TableCell>{m.pages.length}</TableCell>
                                        <TableCell>{m.status}</TableCell>
                                        <TableCell align="right">
                                            {m.status === "Request for Approval" && (
                                                <>
                                                    <Tooltip title="Approve">
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            size="small"
                                                            sx={{ mr: 1 }}
                                                            onClick={() => updateStatus(idx, "Active")}
                                                        >
                                                            Approve
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="Decline">
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            size="small"
                                                            onClick={() => updateStatus(idx, "Draft")}
                                                        >
                                                            Decline
                                                        </Button>
                                                    </Tooltip>
                                                </>
                                            )}

                                            {m.status === "Active" && (
                                                <Tooltip title="Deactivate">
                                                    <Button
                                                        variant="outlined"
                                                        color="warning"
                                                        size="small"
                                                        onClick={() => updateStatus(idx, "Inactive")}
                                                    >
                                                        Deactivate
                                                    </Button>
                                                </Tooltip>
                                            )}

                                            {m.status === "Inactive" && (
                                                <Tooltip title="Reactivate">
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        onClick={() => updateStatus(idx, "Active")}
                                                    >
                                                        Reactivate
                                                    </Button>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            </Box>

            <Snackbar
                open={snack.open}
                autoHideDuration={2500}
                onClose={() => setSnack(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={snack.severity} variant="filled">
                    {snack.msg}
                </Alert>
            </Snackbar>
        </Box>
    );
};

const styles = {
    page: {
        maxWidth: 1200,
        margin: "24px auto",
        padding: "0 16px",
    },
    card: {
        background: "#fff",
        borderRadius: 10,
        padding: 20,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    },
};

export default AdminModuleApproval;
