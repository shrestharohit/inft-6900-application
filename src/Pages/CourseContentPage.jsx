import React from "react";
import { useParams, Link } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { dummyCourses } from "../Pages/dummyData";
import { dummyModules } from "../Pages/dummyModule";

const CourseContentPage = () => {
  const { courseId } = useParams();

  const course = dummyCourses.find((c) => c.id === courseId);
  const modules = dummyModules[courseId] || [];

  if (!course) {
    return <div className="p-4 text-red-500">Course not found!</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Heading */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Course Content</h1>

      <p className="text-gray-600 mb-6">
        Welcome to your course! Here you’ll find lessons and quizzes for{" "}
        <span className="font-semibold">{course.name}</span>.
      </p>

      {/* Modules Section */}
      <div className="space-y-4">
        {modules.map((module) => (
          <div
            key={module.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              {module.title}
            </h2>

            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {module.lessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link
                    to={
                      lesson.title.toLowerCase().includes("quiz")
                        ? `/courses/${courseId}/quizzes/${lesson.id}`
                        : `/courses/${courseId}/modules/${module.id}/lessons/${lesson.id}`
                    }
                    className="text-gray-700 hover:text-blue-600 hover:underline"
                  >
                    {lesson.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default beforeAuthLayout(CourseContentPage);
