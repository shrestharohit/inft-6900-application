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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import useUserApi from "../../hooks/useUserApi";

const ROLES = ["admin", "course_owner"];

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  role: "course_owner",
};

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [snack, setSnack] = useState({
    open: false,
    severity: "success",
    msg: "",
  });
  const [loading, setLoading] = useState(true); // loading state

  const {
    registerPriviledgedUser,
    fetchAllUsers,
    deleteUserById,
    updateUserById,
  } = useUserApi();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAllUsers();
      const list = Array.isArray(data) ? data : data.users || [];
      setUsers(list);
    } catch (err) {
      console.error("Failed to load users", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email";
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
    const u = users[idx];
    setForm({
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role,
    });
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      if (editingIndex === null) {
        await registerPriviledgedUser(form);
      } else {
        const originalUser = users[editingIndex];

        await updateUserById({
          ...form,
          userID: originalUser.userID,
        });
      }
      setSnack({
        open: true,
        severity: "success",
        msg: "User added successfully.",
      });
    } catch (err) {
      setSnack({
        open: true,
        severity: "error",
        msg: "Failed to add user.",
      });
    }
    handleClose();
    fetchUsers();
  };

  const handleDelete = async (idx) => {
    const u = users[idx];
    if (!window.confirm(`Delete ${u.email}?`)) return;

    try {
      await deleteUserById(u.userID);
      setSnack({
        open: true,
        severity: "success",
        msg: "User deleted successfully.",
      });
    } catch (err) {
      setSnack({
        open: true,
        severity: "error",
        msg: "Failed to delete user.",
      });
    }
    fetchUsers();
  };

  const roleMapper = {
    student: "Student",
    course_owner: "Course Owner",
    admin: "Admin",
  };

  return (
    <Box sx={styles.page}>
      <Box sx={styles.card}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h5" fontWeight={700}>
            User Management
          </Typography>
          <Button
            startIcon={<Add />}
            variant="contained"
            color="primary"
            onClick={handleOpenAdd}
          >
            Add Account
          </Button>
        </Stack>

        {loading ? (
          <Box sx={styles.loaderBox}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary" mt={2}>
              Loading users...
            </Typography>
          </Box>
        ) : (
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
                    <TableCell
                      colSpan={4}
                      align="center"
                      sx={{ py: 4, color: "text.secondary" }}
                    >
                      No users yet. Click <b>Add Account</b> to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((u, idx) => (
                    <TableRow key={u.userID || idx} hover>
                      <TableCell>
                        {u.firstName} {u.lastName}
                      </TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{roleMapper[u.role]}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleOpenEdit(idx)}
                            size="small"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDelete(idx)}
                            size="small"
                            color="error"
                          >
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
        )}
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingIndex === null ? "Add Account" : "Edit Account"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
              fullWidth
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
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
              {ROLES.map((r) => (
                <MenuItem key={r} value={r}>
                  {r.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </MenuItem>
              ))}
            </TextField>
            {editingIndex === null && (
              <Alert severity="info">
                Password will be auto-generated and emailed to the new user.
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
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
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
  loaderBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    py: 8,
  },
};

export default AdminUserManagement;
