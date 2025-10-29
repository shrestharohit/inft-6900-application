import React from "react";
import { useParams, Link } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { dummyCourses } from "../Pages/dummyData";
import { dummyModules } from "../Pages/dummyModule";

const ModulePage = () => {
  const { courseId, moduleId } = useParams();
  const course = dummyCourses.find((c) => c.id === courseId);

  if (!course)
    return (
      <div className="p-6 text-red-500 text-center font-semibold text-lg">
        Course not found!
      </div>
    );

  const modules = dummyModules[courseId] || [];
  const module = modules.find((m) => m.id.toString() === moduleId);

  if (!module)
    return (
      <div className="p-6 text-red-500 text-center font-semibold text-lg">
        Module not found!
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
    

      {/* Module Heading */}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-3">{module.title}</h1>
      <p className="text-gray-600 mb-6 text-lg">
        Explore the lessons and quizzes in <span className="font-semibold">{course.name}</span>.
      </p>

      {/* Lessons & Quizzes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {module.lessons.map((lesson) => {
          const isQuiz = lesson.title.toLowerCase().includes("quiz");

          const cardContent = (
            <div
              className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-all border ${
                isQuiz ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-white"
              }`}
            >
              <h2
                className={`text-lg font-semibold mb-2 ${
                  isQuiz ? "text-blue-700" : "text-gray-800"
                }`}
              >
                {lesson.title}
              </h2>
              <p className="text-gray-600 text-sm">
                {isQuiz
                  ? "Test your knowledge with this quiz."
                  : "View lesson content and explanations here."}
              </p>
            </div>
          );

          return isQuiz ? (
            <Link
              key={lesson.id}
              to={`/courses/${courseId}/modules/${moduleId}/quizzes/${lesson.id}`}
              className="block"
            >
              {cardContent}
            </Link>
          ) : (
            <Link
              key={lesson.id}
              to={`/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}`}
              className="block"
            >
              {cardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default beforeAuthLayout(ModulePage);
