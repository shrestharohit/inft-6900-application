import { NavLink, Outlet, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import useQuizApi from "../hooks/useQuizApi";
import useModuleApi from "../hooks/useModuleApi";
import beforeAuthLayout from "../components/BeforeAuth";

function CourseLayout() {
  const { courseId } = useParams();
  const [modules, setModules] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [openModule, setOpenModule] = useState(null);

  const { fetchAllModulesInACourse } = useModuleApi();
  const { fetchQuizForCourse } = useQuizApi();

  useEffect(() => {
    let mounted = true;
    fetchAllModulesInACourse(courseId)
      .then((res) => {
        if (mounted) setModules(Array.isArray(res) ? res : res?.modules || []);
      })
      .catch(() => mounted && setModules([]));
    return () => (mounted = false);
  }, [fetchAllModulesInACourse, courseId]);

  useEffect(() => {
    let mounted = true;
    fetchQuizForCourse(courseId)
      .then((res) => {
        if (mounted) setQuiz(Array.isArray(res) ? res : res?.quizzes || []);
      })
      .catch(() => mounted && setQuiz([]));
    return () => (mounted = false);
  }, [fetchQuizForCourse, courseId]);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar — sits below global header */}
      <aside className="fixed top-[88px] left-0 w-64 bg-white border-r shadow-sm h-[calc(100vh-88px)] overflow-y-auto">
        <NavLink
          to="."
          className="block text-lg font-bold px-4 py-3 border-b hover:bg-gray-100 text-blue-600 cursor-pointer"
        >
          Course Overview
        </NavLink>

        <nav className="flex flex-col space-y-1 p-2">
          {modules?.map((module) => (
            <div key={module.moduleID}>
              <button
                onClick={() =>
                  setOpenModule(openModule === module.moduleID ? null : module.moduleID)
                }
                className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 font-medium flex justify-between items-center"
              >
                {module.title}
                <span>{openModule === module.moduleID ? "▲" : "▼"}</span>
              </button>

              {openModule === module.moduleID && (
                <ul className="ml-4 mt-1 space-y-1">
                  {module.contents?.map((content) => (
                    <li key={content.contentID}>
                      <NavLink
                        to={`modules/${module.moduleID}/lessons/${content.contentID}`}
                        className="block px-3 py-1 text-sm rounded hover:bg-gray-100"
                      >
                        {content.title}
                      </NavLink>
                    </li>
                  ))}
                  <li>
                    <NavLink
                      to={`quizzes/${quiz?.find((x) => x.moduleID === module.moduleID)?.quizID || ""
                        }`}
                      className="block px-3 py-1 text-sm rounded hover:bg-gray-100"
                    >
                      Quiz
                    </NavLink>
                  </li>
                </ul>
              )}
            </div>
          ))}

          <NavLink to="announcements" className="px-4 py-2 rounded hover:bg-gray-100">
            Announcements
          </NavLink>
          <NavLink to="discussions" className="px-4 py-2 rounded hover:bg-gray-100">
            Discussion Board
          </NavLink>
          <NavLink to="questions" className="px-4 py-2 rounded hover:bg-gray-100">
            Ask Question
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 ml-64 mt-[88px] p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default beforeAuthLayout(CourseLayout);
