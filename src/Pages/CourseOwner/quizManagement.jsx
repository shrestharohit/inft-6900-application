// src/Pages/CourseOwner/quizManagement.jsx
import { useState, useEffect } from "react";
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
  IconButton,
  Checkbox,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import useCourseApi from "../../hooks/useCourseApi";
import useModuleApi from "../../hooks/useModuleApi";
import useQuizApi from "../../hooks/useQuizApi";

import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function QuizManagement() {
  const [quizzes, setQuizzes] = useState([]);
  const [allModules, setAllModules] = useState([]);
  const [allCourses, setAllCourses] = useState([]);

  const [form, setForm] = useState({
    courseID: "",
    moduleID: "",
    title: "",
    timeLimit: null, // store as Date object
  });

  const [questions, setQuestions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingQuizIndex, setEditingQuizIndex] = useState(null);

  const [questionForm, setQuestionForm] = useState({
    questionText: "",
    options: [
      { optionText: "", isCorrect: false, feedbackText: "" },
      { optionText: "", isCorrect: false, feedbackText: "" },
    ],
  });

  const { fetchAllCourses } = useCourseApi();
  const { fetchAllModulesInACourse } = useModuleApi();
  const { registerQuiz } = useQuizApi();

  // --- HANDLERS ---

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
          setAllModules(Array.isArray(res) ? res : []);
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
      newOptions = newOptions.map((opt, i) => ({ ...opt, isCorrect: i === index }));
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
      options: [...prev.options, { optionText: "", isCorrect: false, feedbackText: "" }],
    }));
  };

  const deleteOption = (index) => {
    if (questionForm.options.length <= 2) {
      alert("⚠️ A question must have at least 2 options.");
      return;
    }
    const updatedOptions = questionForm.options.filter((_, i) => i !== index);
    setQuestionForm({ ...questionForm, options: updatedOptions });
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

    const updatedQuestions = [...questions];
    if (editingIndex !== null) {
      updatedQuestions[editingIndex] = { ...questionForm, options: questionForm.options.map((o) => ({ ...o })) };
    } else {
      updatedQuestions.push({ ...questionForm, options: questionForm.options.map((o) => ({ ...o })) });
    }
    setQuestions(updatedQuestions);

    // reset question form
    setQuestionForm({
      questionText: "",
      options: [
        { optionText: "", isCorrect: false, feedbackText: "" },
        { optionText: "", isCorrect: false, feedbackText: "" },
      ],
    });
    setEditingIndex(null);
  };

  const deleteQuestion = (qIndex) => {
    const updatedQuestions = questions.filter((_, i) => i !== qIndex);
    setQuestions(updatedQuestions);
    if (editingIndex === qIndex) setEditingIndex(null);
  };

  const handleEditQuestion = (qIndex) => {
    setQuestionForm({ ...questions[qIndex] });
    setEditingIndex(qIndex);
  };

  const handleSaveQuiz = () => {
    if (!form.courseID || !form.moduleID || !form.title || !form.timeLimit) {
      alert("⚠️ Please fill all quiz fields.");
      return;
    }
    if (questions.length === 0) {
      alert("⚠️ Add at least one question.");
      return;
    }

    const updatedQuestions = questions.map((q, i) => ({
      ...q,
      options: q.options.map((o, index) => ({ ...o, optionOrder: index + 1, status: "active" })),
      questionNumber: i + 1,
      status: "active",
    }));

    const newQuiz = { ...form, questions: updatedQuestions, status: "draft" };
    if (editingQuizIndex !== null) {
      const updated = [...quizzes];
      updated[editingQuizIndex] = { ...newQuiz };
      setQuizzes(updated);
    } else {
      setQuizzes([...quizzes, newQuiz]);
      registerQuiz(newQuiz);
    }

    setForm({ courseID: "", moduleID: "", title: "", timeLimit: null });
    setQuestions([]);
    setEditingIndex(null);
    setEditingQuizIndex(null);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const courses = await fetchAllCourses();
        if (!mounted) return;
        setAllCourses(Array.isArray(courses) ? courses : []);
      } catch (err) {
        console.error(err);
        setAllCourses([]);
      }
    })();
    return () => (mounted = false);
  }, [fetchAllCourses]);

  return (
    <Box sx={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Quiz Management
      </Typography>

      <Paper sx={{ padding: "2rem", borderRadius: 3, marginBottom: "2rem" }}>
        <Stack spacing={2}>
          {/* Course Selector */}
          <FormControl fullWidth size="small">
            <InputLabel>Course Title</InputLabel>
            <Select name="courseID" value={form.courseID} onChange={handleChange}>
              {allCourses.map((c) => (
                <MenuItem key={c.courseID} value={c.courseID}>{c.title}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Module Selector */}
          <FormControl fullWidth size="small">
            <InputLabel>Module Title</InputLabel>
            <Select
              name="moduleID"
              value={form.moduleID}
              onChange={handleChange}
              disabled={!form.courseID}
            >
              {allModules.map((m) => (
                <MenuItem key={m.moduleID} value={m.moduleID}>{m.title}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Quiz Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="Time Limit"
                value={form.timeLimit}
                onChange={(newValue) => setForm(prev => ({ ...prev, timeLimit: newValue }))}
                ampm={false}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Stack>

          {/* Questions */}
          <Card sx={{ mt: 2, p: 2 }}>
            <CardContent>
              <Typography variant="h6">Add / Edit Question</Typography>
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
                  <Stack key={i} direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
                    <TextField
                      label={`Option ${i + 1}`}
                      value={opt.optionText}
                      onChange={(e) => handleOptionChange(i, "optionText", e.target.value)}
                      fullWidth
                    />
                    <Checkbox
                      checked={opt.isCorrect}
                      onChange={(e) => handleOptionChange(i, "isCorrect", e.target.checked)}
                    />
                    <TextField
                      label="Feedback"
                      value={opt.feedbackText}
                      onChange={(e) => handleOptionChange(i, "feedbackText", e.target.value)}
                      fullWidth
                    />
                    <IconButton color="error" onClick={() => deleteOption(i)} disabled={questionForm.options.length <= 2}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>
              <Stack direction="row" spacing={2} mt={2}>
  <Button startIcon={<AddCircleOutlineIcon />} onClick={addOption} variant="contained">
    Add Option
  </Button>
  <Button variant="contained" color="primary" onClick={addQuestion}>
    {editingIndex !== null ? "Update Question" : "Add Question"}
  </Button>
</Stack>
            </CardContent>
          </Card>

          <Button variant="contained" color="primary" onClick={handleSaveQuiz} sx={{ mt: 3 }}>
            {editingIndex !== null ? "Update Quiz" : "Save Quiz"}
          </Button>
        </Stack>
      </Paper>

      {/* Existing Quizzes Table */}
      <Paper
        sx={{
          padding: "1.5rem",
          borderRadius: 3,
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Existing Quizzes
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course Title</TableCell>
              <TableCell>Module Title</TableCell>
              <TableCell>Quiz Title</TableCell>
              <TableCell>Time Limit</TableCell>
              <TableCell>Questions</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quizzes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  No quizzes added yet.
                </TableCell>
              </TableRow>
            ) : (
              quizzes.map((quiz, idx) => (
                <TableRow key={idx}>
                  <TableCell>{quiz.courseID}</TableCell>
                  <TableCell>{quiz.moduleID}</TableCell>
                  <TableCell>{quiz.title}</TableCell>
                  <TableCell>
                    {Math.floor(quiz.timeLimit / 60)
                      .toString()
                      .padStart(2, "0")}
                    :
                    {(quiz.timeLimit % 60).toString().padStart(2, "0")}
                  </TableCell>
                  <TableCell>{quiz.questions.length}</TableCell>
                  <TableCell>{quiz.status}</TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
                      {(quiz.status === "draft" ||
                        quiz.status === "inactive") && (
                        <>
                          <Button
                            size="small"
                            onClick={() => handleEditQuiz(idx)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="secondary"
                            onClick={() => handleRequestApproval(idx)}
                          >
                            Request Approval
                          </Button>
                        </>
                      )}
                      {quiz.status === "active" && (
                        <>
                          <Button
                            size="small"
                            onClick={() => handleEditQuiz(idx)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="warning"
                            onClick={() => handleInactivate(idx)}
                          >
                            Inactivate
                          </Button>
                        </>
                      )}
                      {quiz.status === "wait_for_approval" && (
                        <Typography variant="body2" color="text.secondary">
                          Pending with Admin
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
