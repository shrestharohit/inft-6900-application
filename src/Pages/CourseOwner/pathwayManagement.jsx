import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import usePathwayApi from "../../hooks/usePathwayApi";
import { useAuth } from "../../contexts/AuthContext";

const STATUS_OPTIONS = ["draft", "active", "inactive"];

const PathwayManagement = () => {
  const [pathways, setPathways] = useState([]);
  const [form, setForm] = useState({
    name: "",
    outline: "",
    status: "draft",
  });
  const [editingPathwayId, setEditingPathwayId] = useState(null);
  const [descDialogOpen, setDescDialogOpen] = useState(false);
  const [descDraft, setDescDraft] = useState("");

  const { fetchUserPathways, registerPathway, updatePathway } = usePathwayApi();
  const { loggedInUser } = useAuth();

  // ✅ Load pathways once user is ready
  useEffect(() => {
    if (!loggedInUser?.id) return; // wait for user
    let mounted = true;

    const load = async () => {
      try {
        console.log("🔍 Fetching pathways for user:", loggedInUser.id);
        const res = await fetchUserPathways(loggedInUser.id);

        // Handle possible data structures safely
        const data =
          res?.pathways || res?.data?.pathways || res?.data || res || [];

        if (mounted) {
          console.log("✅ Pathways loaded:", data);
          setPathways(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("❌ Failed to load pathways:", err);
        if (mounted) setPathways([]);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [fetchUserPathways, loggedInUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openDescDialog = () => {
    setDescDraft(form.outline || "");
    setDescDialogOpen(true);
  };
  const closeDescDialog = () => setDescDialogOpen(false);
  const saveDescription = () => {
    setForm((prev) => ({ ...prev, outline: descDraft }));
    closeDescDialog();
  };

  const clearForm = () => {
    setForm({ name: "", outline: "", status: "draft" });
    setEditingPathwayId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.outline.trim()) {
      alert("❌ Please fill pathway name and outline.");
      return;
    }

    const cleaned = {
      name: form.name.trim(),
      userID: loggedInUser?.id,
      outline: form.outline.trim(),
      status: form.status,
    };

    try {
      if (editingPathwayId) {
        await updatePathway(editingPathwayId, cleaned);
      } else {
        await registerPathway(cleaned);
      }
      clearForm();

      // Refresh list
      const res = await fetchUserPathways(loggedInUser?.id);
      const data = res?.pathways || res?.data?.pathways || res?.data || res || [];
      setPathways(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to save pathway", err);
      alert("Failed to save pathway. Please try again.");
    }
  };

  const handleEdit = (pathway) => {
    setForm({
      name: pathway.name,
      outline: pathway.outline,
      status: pathway.status || "draft",
    });
    setEditingPathwayId(pathway.pathwayID);
  };

  const toggleActive = async (pathway) => {
    try {
      await updatePathway(pathway.pathwayID, {
        ...pathway,
        status: pathway.status === "active" ? "inactive" : "active",
      });

      const res = await fetchUserPathways(loggedInUser?.id);
      const data = res?.pathways || res?.data?.pathways || res?.data || res || [];
      setPathways(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  return (
    <Box sx={{ padding: "2rem", maxWidth: 1000, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Pathway Management
      </Typography>

      {/* Form */}
      <Paper
        sx={{
          padding: "1.5rem",
          marginBottom: "2rem",
          borderRadius: 3,
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Pathway Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />

            {/* Outline uses dialog for long editing */}
            <TextField
              label="Outline"
              name="outline"
              value={form.outline}
              onClick={openDescDialog}
              multiline
              rows={2}
              fullWidth
              InputProps={{ readOnly: true }}
              required
              helperText="Click to open full editor"
            />

            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained" color="primary">
                {editingPathwayId ? "Update Pathway" : "Add Pathway"}
              </Button>
              {editingPathwayId && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={clearForm}
                >
                  Cancel
                </Button>
              )}
            </Stack>
          </Stack>
        </form>
      </Paper>

      {/* Existing Pathways Table */}
      <Paper
        sx={{
          borderRadius: 3,
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h6" sx={{ padding: "1rem" }}>
          Existing Pathways
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Outline</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pathways.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  No pathways added yet.
                </TableCell>
              </TableRow>
            ) : (
              pathways.map((p, index) => (
                <TableRow key={p.pathwayID || index} hover>
                  <TableCell>{p.name}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 260,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={p.outline}
                  >
                    {p.outline}
                  </TableCell>
                  <TableCell sx={{ textTransform: "uppercase" }}>
                    {p.status}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color={p.status === "active" ? "warning" : "success"}
                        onClick={() => toggleActive(p)}
                      >
                        {p.status === "active" ? "Inactivate" : "Activate"}
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Outline Dialog */}
      <Dialog
        open={descDialogOpen}
        onClose={closeDescDialog}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>Edit Outline</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Outline"
            value={descDraft}
            onChange={(e) => setDescDraft(e.target.value)}
            multiline
            rows={15}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDescDialog}>Cancel</Button>
          <Button onClick={saveDescription} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PathwayManagement;
