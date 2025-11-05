// src/Pages/CourseOwner/PathwayManagement.jsx
import React, { useState, useEffect, useRef } from "react";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import usePathwayApi from "../../hooks/usePathwayApi";
import { useAuth } from "../../contexts/AuthContext";

// ✅ Status labels for consistent display
const STATUS_LABEL = {
  draft: "Draft",
  active: "Active",
  inactive: "Inactive",
};

export default function PathwayManagement() {
  const { loggedInUser } = useAuth();
  const { fetchUserPathways, registerPathway, updatePathway } = usePathwayApi();

  const [pathways, setPathways] = useState([]);
  const [form, setForm] = useState({ name: "", outline: "" });
  const [editingIndex, setEditingIndex] = useState(null);

  // Outline dialog
  const [outlineDialogOpen, setOutlineDialogOpen] = useState(false);
  const [outlinedraft, setOutlinedraft] = useState("");
  const outlineFieldRef = useRef(null);
  const focusGuardRef = useRef(false);

  // Dropdown menu
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuPathway, setMenuPathway] = useState(null);

  // ---- Load pathways ----
  useEffect(() => {
    if (!loggedInUser?.id) return;
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetchUserPathways(loggedInUser.id);
        const list = Array.isArray(res?.pathways)
          ? res.pathways
          : res?.data?.pathways || res?.data || res || [];

        if (mounted) {
          const normalized = list.map((p, idx) => ({
            ...p,
            status: (p.status || "draft").toLowerCase(),
            pathwayID: p.pathwayID || idx + 1,
            userID: p.userID ?? p.userid ?? p.ownerID ?? null, // normalize possible field names
          }));

          // ✅ Strict filter: only show this owner’s pathways
          const ownerOnly = normalized.filter(
            (p) => String(p.userID) === String(loggedInUser.id)
          );

          setPathways(ownerOnly);
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


  // ---- Handlers ----
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setForm({ name: "", outline: "" });
    setEditingIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, outline } = form;

    if (!name?.trim() || !outline?.trim()) {
      alert("❌ Please fill all required fields.");
      return;
    }

    const payload = {
      name: name.trim(),
      outline: outline.trim(),
      userID: loggedInUser?.id,
      status: "draft",
    };

    try {
      if (editingIndex !== null) {
        // --- UPDATE ---
        const pathwayId = pathways[editingIndex]?.pathwayID;
        if (!pathwayId) return alert("Missing pathway ID");

        const res = await updatePathway(pathwayId, payload);
        const updated = res?.pathway || res || payload;

        const normalized = {
          ...updated,
          status: (updated.status || "draft").toLowerCase(),
        };

        const updatedList = pathways.map((p, i) =>
          i === editingIndex ? normalized : p
        );
        setPathways(updatedList);
      } else {
        // --- CREATE ---
        const res = await registerPathway(payload);
        const created = res?.pathway || res || payload;
        const normalized = {
          ...created,
          status: (created.status || "draft").toLowerCase(),
        };
        setPathways((prev) => [...prev, normalized]);
      }

      clearForm();
    } catch (err) {
      console.error("❌ Failed to save pathway:", err);
      alert("Failed to save pathway");
    }
  };

  const handleEdit = (index) => {
    const p = pathways[index];
    setForm({ name: p.name || "", outline: p.outline || "" });
    setEditingIndex(index);
  };

  const handleToggleStatus = async (index) => {
    const target = pathways[index];
    const pathwayId = target?.pathwayID;
    if (!pathwayId) return alert("Missing pathway ID");

    const newStatus =
      target.status === "active" ? "inactive" : "active";

    try {
      const res = await updatePathway(pathwayId, { ...target, status: newStatus });
      const updated = res?.pathway || res || { ...target, status: newStatus };
      const normalized = {
        ...updated,
        status: (updated.status || newStatus).toLowerCase(),
      };

      const updatedList = pathways.map((p, i) =>
        i === index ? normalized : p
      );
      setPathways(updatedList);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to change status");
    }
  };

  // ---- Outline Dialog ----
  const openOutlineDialog = () => {
    setOutlinedraft(form.outline || "");
    setOutlineDialogOpen(true);
  };
  const closeOutlineDialogSafely = () => {
    focusGuardRef.current = true;
    setOutlineDialogOpen(false);
    outlineFieldRef.current?.blur?.();
    setTimeout(() => {
      focusGuardRef.current = false;
    }, 200);
  };
  const handleOutlineCancel = () => {
    setOutlinedraft("");
    closeOutlineDialogSafely();
  };
  const handleOutlineSave = () => {
    setForm((prev) => ({ ...prev, outline: outlinedraft }));
    closeOutlineDialogSafely();
  };
  const handleOutlineFieldFocus = () => {
    if (focusGuardRef.current) return;
    if (!outlineDialogOpen) openOutlineDialog();
  };

  // ---- Dropdown menu ----
  const handleMenuOpen = (event, pathwayWithIndex) => {
    setMenuAnchor(event.currentTarget);
    setMenuPathway(pathwayWithIndex);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuPathway(null);
  };

  return (
    <Box sx={{ padding: "2rem", maxWidth: 1000, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Pathway Management
      </Typography>

      {/* --- Form --- */}
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

            <TextField
              label="Outline"
              name="outline"
              value={form.outline}
              onClick={openOutlineDialog}
              onFocus={handleOutlineFieldFocus}
              inputRef={outlineFieldRef}
              readOnly
              multiline
              rows={2}
              fullWidth
              required
              helperText="Click to open the full editor"
            />

            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained">
                {editingIndex !== null ? "Update Pathway" : "Add Pathway"}
              </Button>
              {editingIndex !== null && (
                <Button variant="outlined" onClick={clearForm}>
                  Cancel
                </Button>
              )}
            </Stack>
          </Stack>
        </form>
      </Paper>

      {/* --- Grouped Accordion Table --- */}
      <Paper
        sx={{
          borderRadius: 3,
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <Typography variant="h6" sx={{ padding: "1rem" }}>
          Existing Pathways
        </Typography>

        {(() => {
          // ✅ Only the owner's pathways, keep global index
          const ownerPathwaysWithIndex = pathways.map((p, __idx) => ({
            ...p,
            __idx,
          }));

          // ✅ Group by status
          const grouped = Object.keys(STATUS_LABEL).reduce((acc, statusKey) => {
            acc[statusKey] = ownerPathwaysWithIndex.filter(
              (p) => (p.status || "draft").toLowerCase() === statusKey
            );
            return acc;
          }, {});

          return Object.entries(grouped).map(([statusKey, group]) => (
            <Accordion key={statusKey} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {STATUS_LABEL[statusKey]} ({group.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {group.length === 0 ? (
                  <Typography
                    variant="body2"
                    sx={{ p: 2, color: "gray", textAlign: "center" }}
                  >
                    No pathways in this status.
                  </Typography>
                ) : (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Outline</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {group.map((pathway) => (
                        <TableRow key={pathway.pathwayID ?? pathway.__idx} hover>
                          <TableCell>{pathway.name}</TableCell>
                          <TableCell
                            sx={{
                              maxWidth: 260,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={pathway.outline}
                          >
                            {pathway.outline}
                          </TableCell>
                          <TableCell>{STATUS_LABEL[statusKey] || "-"}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={(e) =>
                                handleMenuOpen(e, pathway /* has __idx */)
                              }
                              aria-label="Actions"
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </AccordionDetails>
            </Accordion>
          ));
        })()}

        {/* Shared actions menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {menuPathway && (
            <>
              <MenuItem
                onClick={() => {
                  handleEdit(menuPathway.__idx);
                  handleMenuClose();
                }}
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleToggleStatus(menuPathway.__idx);
                  handleMenuClose();
                }}
              >
                {menuPathway.status === "active"
                  ? "Deactivate"
                  : "Activate"}
              </MenuItem>
            </>
          )}
        </Menu>
      </Paper>

      {/* Outline Dialog */}
      <Dialog
        open={outlineDialogOpen}
        onClose={handleOutlineCancel}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>Edit Pathway Outline</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Pathway Outline"
            value={outlinedraft}
            onChange={(e) => setOutlinedraft(e.target.value)}
            multiline
            rows={15}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOutlineCancel}>Cancel</Button>
          <Button onClick={handleOutlineSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
