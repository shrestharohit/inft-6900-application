import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Stack,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Checkbox,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Menu,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useCourseApi from "../../hooks/useCourseApi";
import useModuleApi from "../../hooks/useModuleApi";
import useQuizApi from "../../hooks/useQuizApi";
import { useAuth } from "../../contexts/AuthContext";

const STATUS_LABEL = {
  wait_for_approval: "Wait For Approval",
  draft: "Draft",
  active: "Active",
  inactive: "Inactive",
};

export default function QuizManagement() {
  const [quizzes, setQuizzes] = useState([]);
  const [allModules, setAllModules] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [form, setForm] = useState({
    courseID: "",
    moduleID: "",
    title: "",
    timeLimit: null,
  });
  const [questions, setQuestions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingQuizIndex, setEditingQuizIndex] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    questionText: "",
    options: [
      { optionText: "", isCorrect: false, feedbackText: "" },
      { optionText: "", isCorrect: false, feedbackText: "" },
    ],
  });

  const { fetchAllCourses } = useCourseApi();
  const { fetchAllModulesInACourse } = useModuleApi();
  const { registerQuiz, fetchQuizForCourseOwner, updateQuiz } = useQuizApi();
  const { loggedInUser } = useAuth();

  // --- Menu state (for dropdown actions)
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuQuiz, setMenuQuiz] = useState(null);

  const handleMenuOpen = (event, quizWithIndex) => {
    setMenuAnchor(event.currentTarget);
    setMenuQuiz(quizWithIndex);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuQuiz(null);
  };

  const normalizeToDayjs = (value) => {
    if (value == null) return null;
    if (typeof value === "object" && typeof value.isValid === "function")
      return value;
    if (typeof value === "string" && /^(\d{2}:\d{2})(:\d{2})?$/.test(value)) {
      const [h, m, s = 0] = value.split(":").map(Number);
      return dayjs().hour(h).minute(m).second(s);
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "courseID") {
      (async () => {
        setForm((prev) => ({ ...prev, moduleID: "" }));
        try {
          if (!value) {
            setAllModules([]);
            return;
          }
          const res = await fetchAllModulesInACourse(value);
          setAllModules(res);
        } catch (err) {
          console.error("Failed to load modules for course", err);
          setAllModules([]);
        }
      })();
    }
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setQuestionForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, field, value) => {
    let newOptions = [...questionForm.options];
    if (field === "isCorrect" && value === true) {
      newOptions = newOptions.map((opt, i) => ({
        ...opt,
        isCorrect: i === index,
      }));
    } else {
      newOptions[index] = { ...newOptions[index], [field]: value };
    }
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const addOption = () => {
    if (questionForm.options.length >= 4) {
      alert("⚠️ You cannot add more than 4 options.");
      return;
    }
    setQuestionForm((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        { optionText: "", isCorrect: false, feedbackText: "" },
      ],
    }));
  };

  const deleteOption = (index) => {
    if (questionForm.options.length <= 2) {
      alert("⚠️ A question must have at least 2 options.");
      return;
    }
    setQuestionForm({
      ...questionForm,
      options: questionForm.options.filter((_, i) => i !== index),
    });
  };

  const addQuestion = () => {
    if (!questionForm.questionText || questionForm.options.length < 2) {
      alert("⚠️ A question must have text and at least 2 options.");
      return;
    }
    if (questionForm.options.some((opt) => !opt.optionText.trim())) {
      alert("⚠️ Each option must have text.");
      return;
    }
    if (!questionForm.options.some((opt) => opt.isCorrect)) {
      alert("⚠️ At least one option must be marked correct.");
      return;
    }

    const updated = [...questions];
    if (editingIndex !== null) {
      updated[editingIndex] = { ...questionForm };
    } else updated.push({ ...questionForm });
    setQuestions(updated);
    setQuestionForm({
      questionText: "",
      options: [
        { optionText: "", isCorrect: false, feedbackText: "" },
        { optionText: "", isCorrect: false, feedbackText: "" },
      ],
    });
    setEditingIndex(null);
  };

  const deleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleEditQuestion = (index) => {
    setQuestionForm({ ...questions[index] });
    setEditingIndex(index);
  };

  const handleSaveQuiz = () => {
    if (!form.courseID || !form.moduleID || !form.title) {
      alert("⚠️ Please fill all quiz fields.");
      return;
    }
    if (questions.length === 0) {
      alert("⚠️ Add at least one question.");
      return;
    }

    const updatedQuestions = questions.map((q, i) => ({
      ...q,
      questionNumber: i + 1,
      status: "active",
    }));

    const normalized = normalizeToDayjs(form.timeLimit);
    const payload = {
      ...form,
      timeLimit:
        normalized && normalized.isValid()
          ? normalized.format("HH:mm:ss")
          : form.timeLimit,
      questions: updatedQuestions,
    };

    const newQuiz = {
      ...payload,
      status: quizId ? "wait_for_approval" : "draft",
    };

    if (quizId) updateQuiz(quizId, newQuiz);
    else registerQuiz(newQuiz);

    clearFields();
  };

  const clearFields = () => {
    setForm({ courseID: "", moduleID: "", title: "", timeLimit: null });
    setQuestions([]);
    setQuizId(null);
    setEditingIndex(null);
    setEditingQuizIndex(null);
  };

  const handleEditQuiz = async (index, quizID) => {
    const quiz = quizzes[index];
    setQuizId(quizID);
    const modules = await fetchAllModulesInACourse(quiz.courseID);
    setAllModules(modules);

    setForm({
      courseID: quiz.courseID,
      moduleID: quiz.moduleID,
      title: quiz.title,
      timeLimit: normalizeToDayjs(quiz.timeLimit),
    });
    setQuestions(quiz.questions);
    setEditingQuizIndex(index);
    setEditingIndex(null);
  };

  const handleStatusChange = async (quiz, status) => {
    await updateQuiz(quiz.quizID, { ...quiz, status });
    const res = await fetchQuizForCourseOwner(loggedInUser?.id);
    setQuizzes(res);
  };

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const [quizRes, courseRes] = await Promise.all([
          fetchQuizForCourseOwner(loggedInUser?.id),
          fetchAllCourses(),
        ]);

        if (!mounted) return;
        const courses = courseRes || [];

        // attach readable titles
        const withTitles = quizRes.map((q, idx) => {
          const c = courses.find((x) => x.courseID === q.courseID);
          const m = (q.modules || []).find(
            (mod) => mod.moduleID === q.moduleID
          );
          return {
            ...q,
            __idx: idx,
            courseTitle: c?.title || `Course ${q.courseID}`,
            moduleTitle: m?.title || q.moduleID || "-",
          };
        });

        setAllCourses(courses);
        setQuizzes(withTitles);
      } catch (err) {
        console.error("❌ Failed to load data:", err);
      }
    };
    loadData();
    return () => (mounted = false);
  }, [fetchQuizForCourseOwner, fetchAllCourses, loggedInUser]);

  return (
    <Box sx={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Quiz Management
      </Typography>

      {/* Quiz Form */}
      <Paper
        sx={{
          padding: "2rem",
          marginBottom: "2rem",
          borderRadius: 3,
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Stack spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Course Title</InputLabel>
            <Select
              name="courseID"
              value={form.courseID}
              onChange={handleChange}
              label="Course Title"
            >
              {allCourses.map((c) => (
                <MenuItem key={c.courseID} value={c.courseID}>
                  {c.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" disabled={!form.courseID}>
            <InputLabel>Module Title</InputLabel>
            <Select
              name="moduleID"
              value={form.moduleID}
              onChange={handleChange}
              label="Module Title"
            >
              {allModules.map((m) => (
                <MenuItem key={m.moduleID} value={m.moduleID}>
                  {m.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                label="Quiz Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="Time Limit (HH:mm:ss)"
                  ampm={false}
                  views={["hours", "minutes", "seconds"]}
                  format="HH:mm:ss"
                  value={normalizeToDayjs(form.timeLimit)}
                  onChange={(newValue) =>
                    setForm((prev) => ({ ...prev, timeLimit: newValue }))
                  }
                  slotProps={{
                    textField: { fullWidth: true, size: "small" },
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

          {/* Add/Edit Questions */}
          <Card sx={{ mt: 2, p: 2, backgroundColor: "#f9f9f9" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Add / Edit Question
              </Typography>
              <TextField
                label="Question Text"
                name="questionText"
                value={questionForm.questionText}
                onChange={handleQuestionChange}
                fullWidth
                margin="normal"
              />
              <Stack spacing={2}>
                {questionForm.options.map((opt, i) => (
                  <Stack
                    key={i}
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    alignItems="center"
                  >
                    <TextField
                      label={`Option ${i + 1}`}
                      value={opt.optionText}
                      onChange={(e) =>
                        handleOptionChange(i, "optionText", e.target.value)
                      }
                      fullWidth
                    />
                    <Checkbox
                      checked={opt.isCorrect}
                      onChange={(e) =>
                        handleOptionChange(i, "isCorrect", e.target.checked)
                      }
                    />
                    <TextField
                      label="Feedback"
                      value={opt.feedbackText}
                      onChange={(e) =>
                        handleOptionChange(i, "feedbackText", e.target.value)
                      }
                      fullWidth
                    />
                    <IconButton
                      color="error"
                      onClick={() => deleteOption(i)}
                      disabled={questionForm.options.length <= 2}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>

              <Stack direction="row" spacing={2} mt={2}>
                <Button
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={addOption}
                  variant="contained"
                  color="primary"
                >
                  Add Option
                </Button>
              </Stack>

              <Button
                variant="contained"
                color="primary"
                onClick={addQuestion}
                sx={{ mt: 3 }}
              >
                {editingIndex !== null ? "Update Question" : "Add Question"}
              </Button>
            </CardContent>
          </Card>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveQuiz}
            sx={{ mt: 3, alignSelf: "flex-start" }}
          >
            {quizId ? "Update Quiz" : "Save Quiz"}
          </Button>
        </Stack>
      </Paper>

      {/* --- Grouped Quizzes with Dropdown Actions --- */}
      <Paper
        sx={{
          borderRadius: 3,
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <Typography variant="h6" sx={{ padding: "1rem" }}>
          Existing Quizzes
        </Typography>

        {(() => {
          const grouped = Object.keys(STATUS_LABEL).reduce((acc, key) => {
            acc[key] = quizzes.filter(
              (q) => (q.status || "draft").toLowerCase() === key
            );
            return acc;
          }, {});

          return Object.entries(grouped).map(([statusKey, groupQuizzes]) => (
            <Accordion key={statusKey} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {STATUS_LABEL[statusKey]} ({groupQuizzes.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {groupQuizzes.length === 0 ? (
                  <Typography
                    variant="body2"
                    sx={{ p: 2, color: "gray", textAlign: "center" }}
                  >
                    No quizzes in this status.
                  </Typography>
                ) : (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Course</TableCell>
                        <TableCell>Module</TableCell>
                        <TableCell>Quiz Title</TableCell>
                        <TableCell>Time Limit</TableCell>
                        <TableCell>Questions</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {groupQuizzes.map((quiz) => (
                        <TableRow key={quiz.quizID ?? quiz.__idx} hover>
                          <TableCell>{quiz.courseTitle}</TableCell>
                          <TableCell>{quiz.moduleTitle}</TableCell>
                          <TableCell>{quiz.title}</TableCell>
                          <TableCell>{quiz.timeLimit || "-"}</TableCell>
                          <TableCell>{quiz.questions?.length || 0}</TableCell>
                          <TableCell>
                            {STATUS_LABEL[quiz.status] || "-"}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, quiz)}
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

        {/* Shared Dropdown Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {menuQuiz && (
            <>
              <MenuItem
                onClick={() => {
                  handleEditQuiz(menuQuiz.__idx, menuQuiz.quizID);
                  handleMenuClose();
                }}
              >
                Edit
              </MenuItem>

              {String(menuQuiz.status).toLowerCase() === "draft" && (
                <MenuItem
                  onClick={() => {
                    handleStatusChange(menuQuiz, "wait_for_approval");
                    handleMenuClose();
                  }}
                >
                  Request for Approval
                </MenuItem>
              )}

              {String(menuQuiz.status).toLowerCase() === "active" && (
                <MenuItem
                  onClick={() => {
                    handleStatusChange(menuQuiz, "inactive");
                    handleMenuClose();
                  }}
                >
                  Inactivate
                </MenuItem>
              )}
            </>
          )}
        </Menu>
      </Paper>
    </Box>
  );
}
