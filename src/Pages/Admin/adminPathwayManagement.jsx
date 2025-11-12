import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Tooltip,
  Collapse,
  IconButton,
  Snackbar,
  Alert,
  TextField,
  Stack,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

const STORAGE_KEY = "course_owner_pathways";

export default function AdminPathwayManagement() {
  const [pathways, setPathways] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [editing, setEditing] = useState({});
  const [snack, setSnack] = useState({ open: false, severity: "success", msg: "" });

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setPathways(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pathways));
  }, [pathways]);

  const toggleExpand = (title) => setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));

  const updateStatus = (idx, status) => {
    const updated = [...pathways];
    updated[idx].status = status;
    setPathways(updated);
    setSnack({ open: true, severity: "info", msg: `Pathway marked as ${status}` });
  };

  const saveEdit = (idx, updatedData) => {
    const updated = [...pathways];
    updated[idx] = { ...updated[idx], ...updatedData };
    setPathways(updated);
    setEditing((prev) => ({ ...prev, [idx]: false }));
    setSnack({ open: true, severity: "success", msg: "✅ Pathway updated successfully." });
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "24px auto", padding: "0 16px" }}>
      <Paper sx={{ padding: 3, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          Pathway Management
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pathways.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  No pathways found.
                </TableCell>
              </TableRow>
            ) : (
              pathways.map((p, idx) => (
                <React.Fragment key={idx}>
                  <TableRow hover>
                    <TableCell>
                      <IconButton size="small" onClick={() => toggleExpand(p.title)}>
                        {expanded[p.title] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{p.title}</TableCell>
                    <TableCell>{p.description}</TableCell>
                    <TableCell>{p.status}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit pathway">
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => setEditing((prev) => ({ ...prev, [idx]: true }))}
                        >
                          Edit
                        </Button>
                      </Tooltip>
                      <Tooltip title={p.status === "Inactive" ? "Activate" : "Inactivate"}>
                        <Button
                          variant="outlined"
                          color={p.status === "Inactive" ? "success" : "warning"}
                          size="small"
                          onClick={() =>
                            updateStatus(idx, p.status === "Inactive" ? "Active" : "Inactive")
                          }
                        >
                          {p.status === "Inactive" ? "Activate" : "Inactivate"}
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={5} sx={{ py: 0 }}>
                      <Collapse in={expanded[p.title]} timeout="auto" unmountOnExit>
                        <Box sx={{ m: 2 }}>
                          {editing[idx] ? (
                            <Stack spacing={2}>
                              <TextField
                                fullWidth
                                label="Pathway Title"
                                defaultValue={p.title}
                                onChange={(e) => (p._newTitle = e.target.value)}
                              />
                              <TextField
                                fullWidth
                                label="Description"
                                defaultValue={p.description}
                                onChange={(e) => (p._newDescription = e.target.value)}
                              />
                              <Box>
                                <Button
                                  variant="contained"
                                  color="success"
                                  size="small"
                                  sx={{ mr: 1 }}
                                  onClick={() =>
                                    saveEdit(idx, {
                                      title: p._newTitle || p.title,
                                      description: p._newDescription || p.description,
                                    })
                                  }
                                >
                                  Save
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  size="small"
                                  onClick={() => setEditing((prev) => ({ ...prev, [idx]: false }))}
                                >
                                  Cancel
                                </Button>
                              </Box>
                            </Stack>
                          ) : (
                            <Typography color="text.secondary">{p.description}</Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

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
}
