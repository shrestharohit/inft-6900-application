import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    TextField,
    Stack,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    MenuItem,
    Snackbar,
    Alert,
    Paper,
    Table, TableHead, TableRow, TableCell, TableBody,
    Tooltip
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

const ROLES = ["Admin", "Course Owner"];

const generatePassword = (len = 12) => {
    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
    let out = "";
    for (let i = 0; i < len; i++)
        out += chars[Math.floor(Math.random() * chars.length)];
    return out;
};

const sendNewAccountEmail = ({ email, fullName, role, password }) => {
    console.log(
        `[EMAIL -> ${email}] Welcome ${fullName} (${role}). Temporary password: ${password}`
    );
};

const STORAGE_KEY = "admin_users";

const emptyForm = {
    fullName: "",
    email: "",
    role: "Course Owner",
};

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [snack, setSnack] = useState({ open: false, severity: "success", msg: "" });

    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                setUsers(JSON.parse(raw));
            } catch {
                setUsers([]);
            }
        }
    }, []);
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }, [users]);

    const validate = () => {
        const e = {};
        if (!form.fullName.trim()) e.fullName = "Full name is required";
        if (!form.email.trim()) e.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
        if (!ROLES.includes(form.role)) e.role = "Choose a role";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const resetDialog = () => {
        setForm(emptyForm);
        setErrors({});
        setEditingIndex(null);
    };

    const handleOpenAdd = () => {
        resetDialog();
        setOpen(true);
    };
    const handleOpenEdit = (idx) => {
        setEditingIndex(idx);
        setForm({
            fullName: users[idx].fullName,
            email: users[idx].email,
            role: users[idx].role,
        });
        setErrors({});
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!validate()) return;

        if (editingIndex === null) {
            const password = generatePassword();
            const newUser = {
                id: Date.now().toString(),
                ...form,
                createdAt: new Date().toISOString(),
            };
            setUsers(prev => [newUser, ...prev]);
            sendNewAccountEmail({
                email: form.email,
                fullName: form.fullName,
                role: form.role,
                password,
            });
            setSnack({ open: true, severity: "success", msg: "Account created and email sent." });
        } else {
            const next = [...users];
            next[editingIndex] = { ...next[editingIndex], ...form };
            setUsers(next);
            setSnack({ open: true, severity: "success", msg: "Account updated." });
        }
        handleClose();
    };

    const handleDelete = (idx) => {
        const u = users[idx];
        if (!window.confirm(`Delete ${u.fullName || u.email}?`)) return;
        setUsers(prev => prev.filter((_, i) => i !== idx));
        setSnack({ open: true, severity: "info", msg: "Account deleted." });
    };

    return (
        <Box sx={styles.page}>
            <Box sx={styles.card}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h5" fontWeight={700}>User Management</Typography>
                    <Button
                        startIcon={<Add />}
                        variant="contained"
                        color="primary"
                        onClick={handleOpenAdd}
                        sx={{ ml: 2 }} // <-- adds spacing between title and button
                    >
                        Add Account
                    </Button>
                </Stack>

                <Paper variant="outlined">
                    <Table>
                        <TableHead sx={{ background: "#f7f7f9" }}>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: "text.secondary" }}>
                                        No users yet. Click <b>Add Account</b> to create one.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((u, idx) => (
                                    <TableRow key={u.id || idx} hover>
                                        <TableCell>{u.fullName}</TableCell>
                                        <TableCell>{u.email}</TableCell>
                                        <TableCell>{u.role}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Edit">
                                                <IconButton onClick={() => handleOpenEdit(idx)} size="small">
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton onClick={() => handleDelete(idx)} size="small" color="error">
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            </Box>

            {/* Add/Edit Dialog */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>{editingIndex === null ? "Add Account" : "Edit Account"}</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Full Name"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            error={!!errors.fullName}
                            helperText={errors.fullName}
                            fullWidth
                        />
                        <TextField
                            label="Email Address"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            fullWidth
                        />
                        <TextField
                            select
                            label="Role"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            error={!!errors.role}
                            helperText={errors.role}
                            fullWidth
                        >
                            {ROLES.map(r => (
                                <MenuItem key={r} value={r}>{r}</MenuItem>
                            ))}
                        </TextField>
                        {editingIndex === null && (
                            <Alert severity="info">
                                Password will be auto-generated and emailed to the new user. Two-factor setup is not required.
                            </Alert>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>
                        {editingIndex === null ? "Create" : "Save Changes"}
                    </Button>
                </DialogActions>
            </Dialog>

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
        maxWidth: 1100,
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

export default AdminUserManagement;
