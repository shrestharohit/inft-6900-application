import { createBrowserRouter } from "react-router-dom";

// Public pages
import Home from "../Pages/Home";
import RegistrationForm from "../Pages/registration";
import LoginForm from "../Pages/login";
import Login2FA from "../Pages/login2fa";
import ForgotPassword from "../Pages/forgotpassword";
import ProfileManagement from "../Pages/profilemanagement";

// Admin imports
import AdminLayout from "../Pages/Admin/adminlayout";
import AdminUserManagement from "../Pages/Admin/adminUserManagement";
import AdminCourseApproval from "../Pages/Admin/adminCourseApproval";
import AdminModuleApproval from "../Pages/Admin/adminModuleApproval";
import AdminQuizApproval from "../Pages/Admin/adminQuizApproval";
import AdminProfile from "../Pages/Admin/AdminProfile";

// Student imports
import Dashboard from "../Pages/Dashboard";
import CourseLayout from "../Pages/CourseLayout";
import CoursePage from "../Pages/CoursePage";
import CourseContentPage from "../Pages/CourseContentPage";
import ModulePage from "../Pages/ModulePage";
import QuizPage from "../Pages/QuizPage";
import LessonPage from "../Pages/LessonPage";
import PathwayPage from "../Pages/PathwayPage";
import PathwayContentPage from "../Pages/PathwayContentPage";
import CourseQuestionsPage from "../Pages/CourseQuestionsPage";
import StudentAnnouncementsPage from "../Pages/StudentAnnouncementsPage";
import StudentDiscussionPage from "../Pages/StudentDiscussionPage";

import SearchResults from "../Pages/SearchResults";
import CertificatePage from "../Pages/certificatePage";

import {
  DashboardPage,
  PathwaysPage,
  CoursesPage,
  EnrollmentsPage,
  MessagesPage,
} from "../Pages/Admin/pagesPlaceholders";

// Course Owner imports
import CourseOwnerDashboard from "../Pages/CourseOwner/CourseOwnerDashboard";
import CourseManagement from "../Pages/CourseOwner/courseManagement";
import CourseOwnerLayout from "../Pages/CourseOwner/courseOwnerLayout";
import ModuleManagement from "../Pages/CourseOwner/moduleManagement";
import QuizManagement from "../Pages/CourseOwner/quizManagement";
import CourseOwnerProfile from "../Pages/CourseOwner/courseOwnerProfile";
import CourseOwnerAnnouncementsPage from "../Pages/CourseOwner/CourseOwnerAnnouncementsPage";
import CourseOwnerDiscussionPage from "../Pages/CourseOwner/CourseOwnerDiscussionPage";
import CourseOwnerQuestionsPage from "../Pages/CourseOwner/CourseOwnerQuestionsPage";

// All Courses and Pathways Pages
import AllCoursesPage from "../Pages/AllCoursesPage";
import AllPathwaysPage from "../Pages/AllPathwaysPage";

export const router = createBrowserRouter([
  // Public routes
  { path: "/", element: <Home /> },
  { path: "/registration", element: <RegistrationForm /> },
  { path: "/login", element: <LoginForm /> },
  { path: "/login2fa", element: <Login2FA /> },
  { path: "/forgotpassword", element: <ForgotPassword /> },
  { path: "/profilemanagement", element: <ProfileManagement /> },

  // Pathways routes
  { path: "/pathway/:pathwayId", element: <PathwayPage /> },
  { path: "/pathway/:pathwayId/content", element: <PathwayContentPage /> },

  // Student course routes
  {path: "/dashboard",element: <Dashboard />}, 
  {
    path: "/courses/:courseId",
    children: [
      { index: true, element: <CoursePage /> }, // overview page (no sidebar)
      {
        element: <CourseLayout />, // wrap all sidebar pages
        children: [
          { path: "content", element: <CourseContentPage /> },
          { path: "questions", element: <CourseQuestionsPage /> },
          { path: "modules/:moduleId", element: <ModulePage /> },
          { path: "modules/:moduleId/lessons/:lessonId", element: <LessonPage /> },
          { path: "quizzes/:quizId", element: <QuizPage /> },
          { path: "announcements", element: <StudentAnnouncementsPage /> },
          { path: "discussions", element: <StudentDiscussionPage /> },
          { path: "certificate", element: <CertificatePage /> },
        ],
      },
    ],
  },

  // Admin routes
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "pathways", element: <PathwaysPage /> },
      { path: "courses", element: <CoursesPage /> },
      { path: "enrollments", element: <EnrollmentsPage /> },
      { path: "users", element: <AdminUserManagement /> },
      { path: "messages", element: <MessagesPage /> },
      { path: "profile", element: <AdminProfile title="Profile Page" /> },
      { path: "course-approvals", element: <AdminCourseApproval /> },
      { path: "module-approvals", element: <AdminModuleApproval /> },
      { path: "quiz-approvals", element: <AdminQuizApproval /> },
    ],
  },

  // Course Owner routes
  {
    path: "/courseowner",
    element: <CourseOwnerLayout />,
    children: [
      { index: true, element: <CourseOwnerDashboard /> }, // default landing page
      { path: "courses", element: <CourseManagement /> },
      { path: "modules", element: <ModuleManagement /> },
      { path: "quizzes", element: <QuizManagement /> },
      { path: "profile", element: <CourseOwnerProfile title="Profile Page" /> },
      { path: "announcements", element: <CourseOwnerAnnouncementsPage /> },
      { path: "discussions", element: <CourseOwnerDiscussionPage /> },
      { path: "questions", element: <CourseOwnerQuestionsPage /> },
    ],
  },


  // Search & global
  { path: "/search", element: <SearchResults /> },
  { path: "/all-courses", element: <AllCoursesPage /> },
  { path: "/all-pathways", element: <AllPathwaysPage /> },
]);
