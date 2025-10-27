// src/Pages/CourseOwner/quizManagement.jsx
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
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import useCourseApi from "../../hooks/useCourseApi";
import useModuleApi from "../../hooks/useModuleApi";
import useQuizApi from "../../hooks/useQuizApi";
import { useAuth } from "../../contexts/AuthContext";

const STORAGE_KEY_QUIZZES = "course_owner_quizzes";

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

  // Normalize various time representations to a dayjs object for the TimePicker.
  const normalizeToDayjs = (value) => {
    if (value == null) return null;
    // already a dayjs-like object
    if (typeof value === "object" && typeof value.isValid === "function")
      return value;
    // accept HH:mm or HH:mm:ss strings
    if (typeof value === "string" && /^(\d{2}:\d{2})(:\d{2})?$/.test(value)) {
      const parts = value.split(":");
      const h = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const s = parts[2] ? parseInt(parts[2], 10) : 0;
      return dayjs().hour(h).minute(m).second(s);
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "courseID")
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
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setQuestionForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, field, value) => {
    let newOptions = [...questionForm.options];

    if (field === "isCorrect" && value === true) {
      // when one option is selected as correct, clear others
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
      updatedQuestions[editingIndex] = {
        ...questionForm,
        options: questionForm.options.map((o) => ({ ...o })),
      };
    } else {
      updatedQuestions.push({
        ...questionForm,
        options: questionForm.options.map((o) => ({ ...o })),
      });
    }
    setQuestions(updatedQuestions);

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
    if (questions.length === 1) {
      if (editingQuizIndex !== null) {
        const updatedQuizzes = quizzes.filter((_, i) => i !== editingQuizIndex);
        setQuizzes(updatedQuizzes);
      }
      setQuestions([]);
      setForm({
        courseID: "",
        moduleID: "",
        title: "",
        timeLimit: null,
      });
      setQuestionForm({
        questionText: "",
        options: [
          { optionText: "", isCorrect: false, feedbackText: "" },
          { optionText: "", isCorrect: false, feedbackText: "" },
        ],
      });
      setEditingIndex(null);
      setEditingQuizIndex(null);
      return;
    }

    const updatedQuestions = questions.filter((_, i) => i !== qIndex);
    setQuestions(updatedQuestions);

    if (editingIndex === qIndex) {
      setQuestionForm({
        questionText: "",
        options: [
          { optionText: "", isCorrect: false, feedbackText: "" },
          { optionText: "", isCorrect: false, feedbackText: "" },
        ],
      });
      setEditingIndex(null);
    }
  };

  const handleEditQuestion = (qIndex) => {
    setQuestionForm({ ...questions[qIndex] });
    setEditingIndex(qIndex);
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
      options: q.options.map((o, index) => ({
        ...o,
        optionOrder: index + 1,
        status: "active",
      })),
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
    const newQuiz = payload;
    if (quizId !== null) {
      newQuiz.status = "wait_for_approval";
      updateQuiz(quizId, newQuiz);
    } else {
      newQuiz.status = "draft";
      registerQuiz(newQuiz);
    }
    clearFields();
  };

  const clearFields = () => {
    setForm({ courseID: "", moduleID: "", title: "", timeLimit: null });
    setQuestions([]);
    setQuizId(null);
    setEditingIndex(null);
    setEditingQuizIndex(null);
  };

  const handleEditQuiz = async (index, quizId) => {
    setQuizId(quizId);
    const quiz = quizzes[index];
    const res = await fetchAllModulesInACourse(quiz.courseID);
    setAllModules(res);
    setForm({
      courseID: quiz.courseID,
      moduleID: quiz.moduleID,
      title: quiz.title,
      timeLimit:
        quiz.timeLimit &&
        typeof quiz.timeLimit === "string" &&
        /^(\d{2}:\d{2})(:\d{2})?$/.test(quiz.timeLimit)
          ? (() => {
              const parts = quiz.timeLimit.split(":");
              const h = parseInt(parts[0], 10);
              const m = parseInt(parts[1], 10);
              const s = parts[2] ? parseInt(parts[2], 10) : 0;
              return dayjs().hour(h).minute(m).second(s);
            })()
          : quiz.timeLimit,
    });
    setQuestions(
      quiz.questions.map((q) => ({
        ...q,
        options: q.options.map((o) => ({ ...o })),
      }))
    );
    setEditingQuizIndex(index);
    setEditingIndex(null);

    // Reset status to Draft when editing if Active or Inactive
    const updated = [...quizzes];
    if (quiz.status === "Active" || quiz.status === "Inactive")
      updated[index].status = "Draft";
    setQuizzes(updated);
  };

  const handleStatusChange = async (quiz, status) => {
    const payload = { ...quiz, status };
    await updateQuiz(quiz.quizID, payload);
    const res = await fetchQuizForCourseOwner(loggedInUser?.id);
    setQuizzes(res);
  };

  useEffect(() => {
    let mounted = true;
    const loadInitialData = async () => {
      try {
        const res = await fetchQuizForCourseOwner(loggedInUser?.id);

        const coursesResponse = await fetchAllCourses();
        const courseList = coursesResponse || [];

        if (!mounted) return;
        setAllCourses(courseList);
        setQuizzes(res);
      } catch (e) {
        console.error("Failed to load data", e);
      }
    };

    loadInitialData();
    return () => (mounted = false);
  }, [fetchQuizForCourseOwner, fetchAllCourses]);

  const statusMapper = {
    wait_for_approval: "Wait For Approval",
    draft: "Draft",
    active: "Active",
    inactive: "Inactive",
  };

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
              {allCourses.map((c, idx) => (
                <MenuItem key={idx} value={c.courseID}>
                  {c.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Module Title</InputLabel>
            <Select
              name="moduleID"
              value={form.moduleID}
              onChange={handleChange}
              label="Module Title"
              disabled={!form.courseID}
            >
              {allModules.map((m, idx) => (
                <MenuItem key={idx} value={m.moduleID}>
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



          {/* Question Card */}
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
                    {/* Delete Option Button */}
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
                {/* <Button variant="contained" color="primary" component="label">
                  Upload Image
                  <input type="file" hidden onChange={handleQuestionImage} />
                </Button> */}
              </Stack>
              {/* {questionForm.image && (
                <Box mt={2}>
                  <img
                    src={questionForm.image}
                    alt="Question"
                    style={{ maxWidth: 250, borderRadius: 8 }}
                  />
                </Box>
              )} */}
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

          {/* Questions Preview */}
          {questions.length > 0 && (
            <Paper sx={{ mt: 3, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Questions Preview
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Question</TableCell>
                    <TableCell>Options</TableCell>
                    <TableCell>Correct</TableCell>
                    <TableCell>Feedback</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions.map((q, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{q.questionText}</TableCell>
                      <TableCell>
                        {q.options.map((o, i) => (
                          <div key={i}>
                            {i + 1}. {o.optionText}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        {q.options
                          .map((o, i) =>
                            o.isCorrect ? `Option ${i + 1}` : null
                          )
                          .filter(Boolean)
                          .join(", ")}
                      </TableCell>
                      <TableCell>
                        {q.options.map((o, i) => (
                          <div key={i}>
                            {i + 1}. {o.feedbackText}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            onClick={() => handleEditQuestion(idx)}
                          >
                            Edit
                          </Button>
                          <IconButton
                            color="error"
                            onClick={() => deleteQuestion(idx)}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveQuiz}
            sx={{ mt: 3, alignSelf: "flex-start" }}
          >
            {quizId !== null ? "Update Quiz" : "Save Quiz"}
          </Button>
        </Stack>
      </Paper>

      {/* Existing Quizzes */}
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
                    {quiz.timeLimit
                      ? typeof quiz.timeLimit === "string"
                        ? /^(\d{2}:\d{2})(:\d{2})?$/.test(quiz.timeLimit)
                          ? quiz.timeLimit.length === 5
                            ? `${quiz.timeLimit}:00`
                            : quiz.timeLimit
                          : `${quiz.timeLimit}min`
                        : `${quiz.timeLimit}min`
                      : "-"}
                  </TableCell>
                  <TableCell>{quiz.questions.length}</TableCell>
                  <TableCell>{statusMapper[quiz.status]}</TableCell>
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
                            onClick={() => handleEditQuiz(idx, quiz.quizID)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="secondary"
                            onClick={() =>
                              handleStatusChange(quiz, "wait_for_approval")
                            }
                          >
                            Request Approval
                          </Button>
                        </>
                      )}
                      {quiz.status === "active" && (
                        <>
                          <Button
                            size="small"
                            onClick={() => handleEditQuiz(idx, quiz.quizID)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="warning"
                            onClick={() => handleStatusChange(quiz, "inactive")}
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
