// src/Pages/CourseContentPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useCourseApi from "../hooks/useCourseApi";
import useQuizApi from "../hooks/useQuizApi";
import useModuleApi from "../hooks/useModuleApi";

const CourseContentPage = () => {
  const { courseId } = useParams();

  const [status, setStatus] = useState("loading"); // "idle" | "loading" | "success" | "not_found" | "error"
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const { fetchCourse } = useCourseApi();
  const { fetchQuizForCourse } = useQuizApi();
  const { fetchAllModulesInACourse } = useModuleApi();

  // --------- Scroll to top on page load ---------
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [courseId]);

  useEffect(() => {
    let active = true;
    setStatus("loading");

    (async () => {
      try {
        const [courseRes, modulesRes, quizzesRes] = await Promise.all([
          fetchCourse(courseId),
          fetchAllModulesInACourse(courseId),
          fetchQuizForCourse(courseId),
        ]);

        if (!active) return;

        if (
          !courseRes ||
          (!courseRes.courseID && !courseRes.id) ||
          (!courseRes.title && !courseRes.name)
        ) {
          setStatus("not_found");
          return;
        }

        setCourse(courseRes);
        setModules(
          Array.isArray(modulesRes) ? modulesRes : modulesRes?.modules || []
        );
        setQuizzes(
          Array.isArray(quizzesRes) ? quizzesRes : quizzesRes?.quizzes || []
        );

        setStatus("success");
      } catch (err) {
        const code = err?.response?.status;
        if (code === 404) setStatus("not_found");
        else {
          console.error("Course load failed:", err);
          setStatus("error");
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [courseId, fetchCourse, fetchAllModulesInACourse, fetchQuizForCourse]);

  // ---------- Render gates ----------
  if (status === "loading") {
    return (
      <div className="max-w-7xl mx-auto p-6 min-h-screen animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded mb-4" />
        <div className="h-4 w-96 bg-gray-200 rounded mb-6" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow">
              <div className="h-5 w-52 bg-gray-200 rounded mb-3" />
              <div className="h-4 w-80 bg-gray-200 rounded mb-1" />
              <div className="h-4 w-72 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (status === "not_found") {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-red-600 font-semibold">
        Course not found.
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-amber-600 font-semibold">
        Something went wrong loading the course. Please try again.
      </div>
    );
  }

  // ---------- Normal content ----------
  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        {course?.title || "Course Content"}
      </h1>

      <p className="text-gray-600 mb-6">
        Welcome to your course! Here you’ll find lessons and quizzes for{" "}
        <span className="font-semibold">{course?.title}</span>.
      </p>

      <div className="space-y-4">
        {modules.length === 0 ? (
          <div className="p-4 bg-gray-100 text-gray-500 rounded-lg text-center">
            No modules available yet.
          </div>
        ) : (
          modules.map((module) => (
            <div
              key={module.moduleID}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-blue-600 mb-2">
                {module.title}
              </h2>

              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {module.contents?.map((content) => (
                  <li key={content.contentID}>
                    <Link
                      to={`/courses/${courseId}/modules/${module.moduleID}/lessons/${content.contentID}`}
                      className="text-gray-700 hover:text-blue-600 hover:underline"
                    >
                      {content.title}
                    </Link>
                  </li>
                ))}

                {quizzes?.find((x) => x.moduleID === module.moduleID) && (
                  <li>
                    <Link
                      to={`/courses/${courseId}/modules/${
                        module.moduleID
                      }/quizzes/${
                        quizzes.find((x) => x.moduleID === module.moduleID)
                          ?.quizID || ""
                      }`}
                      className="text-gray-700 hover:text-blue-600 hover:underline"
                    >
                      Quiz
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseContentPage;
