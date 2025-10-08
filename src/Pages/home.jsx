import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { dummyCourses, dummyPathways } from "../Pages/dummyData";
import { useAuth } from "../contexts/AuthContext"; // ✅
import useCourseApi from "../hooks/useCourseApi";
//import webdevremovebg from "../assets/Images/webdevremovebg.png";

function Home() {
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [hoveredPathway, setHoveredPathway] = useState(null);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth(); // ✅ check login state

  const { fetchPopularCoursesAndPathway } = useCourseApi();

  const [apiPopularCourses, setApiPopularCourses] = useState(null);
  const [apiPopularPathways, setApiPopularPathways] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetchPopularCoursesAndPathway();
        console.log("Full API response:", JSON.stringify(res, null, 2));
        if (!mounted) return;
        setApiPopularCourses(res?.popularCourses || null);
        setApiPopularPathways(res?.popularPathways || res?.pathways || null);
      } catch (e) {
        console.error("Failed to load popular courses/pathways", e);
        if (mounted) {
          setApiPopularCourses(null);
          setApiPopularPathways(null);
        }
      }
    };

    load();
    return () => (mounted = false);
  }, [fetchPopularCoursesAndPathway]);

  // UI-ready data: map API objects to the shape the page expects (id, name, img)
  const popularCourses =
    apiPopularCourses
      ?.map((c, i) => {
        return {
          id: String(c.courseID || c.id),
          name: c.title || c.name || `Course ${id}`,
          img: webdevremovebg,
          meta: c,
        };
      })
      .slice(0, 3) || [];

  const trendingPathways =
    apiPopularPathways?.map((p) => {
      return {
        id: String(p.pathwayID || p.id),
        name: p.name || p.title,
        img: webdevremovebg,
        description: p.description || "",
        meta: p,
      };
    }) || [];

  const toId = (c) =>
    typeof c === "string" || typeof c === "number"
      ? String(c)
      : String(c?.id || "");
  const getCourseById = (id) =>
    dummyCourses.find((x) => String(x.id) === String(id));

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/dashboard"); // ✅ go to new dashboard page
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="bg-gray-50 font-inter pb-12 pt-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1f2a60] to-[#4856a6] text-white rounded-xl my-8 max-w-[1150px] mx-auto shadow-lg">
        <div className="text-center py-20 px-6 max-w-3xl mx-auto">
          <h1 className="font-extrabold text-4xl mb-3">
            Learn Today. Lead Tomorrow.
          </h1>
          <p className="text-lg opacity-90 mb-6">
            Build real skills with hands-on courses and guided pathways.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-green-500 text-[#0b142b] px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:bg-green-600"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="max-w-[1150px] mx-auto bg-white rounded-xl shadow p-8 my-10">
        <h2 className="text-3xl font-extrabold text-[#1f2a60] text-center mb-8">
          Most Popular Courses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {popularCourses.map((course, idx) => {
            const isHover = hoveredCourse === idx;
            return (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className={`bg-white rounded-xl shadow-md text-center p-6 transition transform ${
                  isHover ? "-translate-y-2 shadow-xl" : ""
                }`}
                onMouseEnter={() => setHoveredCourse(idx)}
                onMouseLeave={() => setHoveredCourse(null)}
              >
                <img
                  src={course.img}
                  alt={course.name}
                  className="w-24 h-24 object-contain mx-auto mb-4"
                />
                <h3 className="font-bold text-lg mb-2">{course.name}</h3>
                <p className="text-gray-600 text-sm">
                  Explore {course.name} with projects and expert mentors.
                </p>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/all-courses"
            className="inline-block bg-gradient-to-r from-[#1f2a60] to-[#4856a6] text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-[#174bcc] my-8 max-w-[1150px] mx-auto"
          >
            View All Courses
          </Link>
        </div>
      </section>

      {/* Trending Pathways */}
      <section className="max-w-[1150px] mx-auto bg-white rounded-xl shadow p-8 my-10">
        <h2 className="text-3xl font-extrabold text-[#1f2a60] text-center mb-8">
          Trending Pathways
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {trendingPathways.map((pathway, idx) => {
            const isHover = hoveredPathway === idx;
            const courseIds = (pathway.courses || []).map(toId).filter(Boolean);

            return (
              <div
                key={pathway.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/pathway/${pathway.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    navigate(`/pathway/${pathway.id}`);
                }}
                className={`bg-white rounded-xl shadow-md text-center p-6 transition transform cursor-pointer flex flex-col h-full ${
                  isHover ? "-translate-y-2 shadow-xl" : ""
                }`}
                onMouseEnter={() => setHoveredPathway(idx)}
                onMouseLeave={() => setHoveredPathway(null)}
              >
                <img
                  src={pathway.img}
                  alt={pathway.name}
                  className="w-24 h-24 object-contain mx-auto mb-4"
                />
                <h3 className="font-bold text-lg mb-2">{pathway.name}</h3>
                <p className="text-gray-600 text-sm mb-3 min-h-[48px]">
                  {pathway.description}
                </p>

                {/* Chips pinned to the bottom across all cards */}
                <div className="mt-auto">
                  <div className="flex justify-center flex-wrap gap-2">
                    {courseIds.map((cid) => {
                      const course = getCourseById(cid);
                      const label = course?.name || `Course ${cid}`;
                      return (
                        <button
                          key={cid}
                          onClick={(e) => {
                            e.stopPropagation(); // don't trigger the card click
                            navigate(`/courses/${cid}`);
                          }}
                          className="px-4 py-1 rounded-full bg-green-500 text-[#0b142b] text-sm font-bold shadow hover:bg-green-600"
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/all-pathways"
            className="inline-block bg-gradient-to-r from-[#1f2a60] to-[#4856a6] text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-[#174bcc] my-8 max-w-[1150px] mx-auto"
          >
            View All Pathways
          </Link>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-[1150px] mx-auto bg-white rounded-xl shadow p-8 my-10">
        <h2 className="text-3xl font-extrabold text-[#1f2a60] text-center mb-8">
          What Learners Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            {
              name: "Alex",
              text: "This platform really helped me grow my career.",
            },
            { name: "Sarah", text: "Amazing courses with practical projects." },
            {
              name: "John",
              text: "The user experience is smooth and motivating.",
            },
          ].map((review, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 flex flex-col justify-between items-center text-center shadow h-56"
            >
              <p className="italic text-gray-700">"{review.text}"</p>
              <div>
                <span className="block font-bold text-[#1f2a60]">
                  – {review.name}
                </span>
                <div className="mt-2 text-yellow-500">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default beforeAuthLayout(Home);
