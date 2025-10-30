import { useAuth } from "../contexts/AuthContext";

export default function useRoleAccess() {
    const { loggedInUser } = useAuth();
    const role = loggedInUser?.role || "guest";

    const isAdmin = role === "admin";
    const isStudent = role === "student";
    const isCourseOwner = role === "course_owner";

    return {
        role,
        isAdmin,
        isStudent,
        isCourseOwner,

        // 🔹 General visibility
        canViewCourses: isStudent || isAdmin || isCourseOwner,
        canViewModules: isStudent || isAdmin || isCourseOwner,
        canViewLessons: isStudent || isAdmin || isCourseOwner,
        canViewAnnouncements: isStudent || isAdmin || isCourseOwner,
        canViewPathways: isStudent || isAdmin || isCourseOwner,

        // 🔹 Student learning actions
        canEnroll: isStudent,
        canPomodoro: isStudent,        // Only students use focus timer
        canSchedule: isStudent,        // Students manage learning schedule
        canAttemptQuiz: isStudent,     // Admin/course_owner = read-only
        canPostDiscussion: isStudent || isCourseOwner,
        canSubmitQuestions: isStudent,
        canLeaveReview: isStudent,     // Only students review courses

        // 🔹 Content management
        canCreateCourse: isCourseOwner || isAdmin,
        canCreateModule: isCourseOwner || isAdmin,
        canCreateLesson: isCourseOwner || isAdmin,
        canCreateQuiz: isCourseOwner || isAdmin,
        canCreateAnnouncement: isCourseOwner || isAdmin,

        // 🔹 Administrative control
        canApproveCourses: isAdmin,
        canApproveModules: isAdmin,
        canApproveQuizzes: isAdmin,
        canApprovePathways: isAdmin,
        canManageUsers: isAdmin,

        // 🔹 Default fallbacks
        canViewDashboard: isStudent || isAdmin || isCourseOwner,
    };
}
