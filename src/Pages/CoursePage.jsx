import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { useAuth } from "../contexts/AuthContext";
import { dummyCourses } from "../Pages/dummyData"; // ✅ central source

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { loggedInUser, isLoggedIn, enrollInCourse, completeCourse } = useAuth();

  const [course, setCourse] = useState(null);
  const [status, setStatus] = useState(null); // locked / unlocked / completed / null
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const selectedCourse = dummyCourses.find((c) => c.id === courseId);
    setCourse(selectedCourse);

    if (isLoggedIn && loggedInUser?.enrolledCourses) {
      setStatus(loggedInUser.enrolledCourses[courseId]?.status || null);
    } else {
      setStatus(null);
    }
  }, [courseId, isLoggedIn, loggedInUser]);

  if (!course) {
    return <div>Course not found!</div>;
  }

  const handleEnroll = () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/courses/${courseId}` } });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      enrollInCourse(courseId);
      setStatus("unlocked");
      alert(`Successfully enrolled in ${course.name}`);
      setLoading(false);
    }, 500);
  };

  const handleComplete = () => {
    completeCourse(courseId);
    setStatus("completed");
  };

  const hasOutline = course.outline && course.outline.modules;
  const reviews = course.reviews || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Back to Search Results */}
      <div className="mb-4">
        <Link to="/search" className="text-sm text-gray-600 hover:underline">
          &larr; Back to Search Results
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Image */}
        <div className="flex-shrink-0 w-full md:w-1/3">
          <img
            src={course.img}
            alt={course.name}
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Content */}
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold text-gray-800">{course.name}</h1>
          <p className="text-lg text-gray-600 mt-2">{course.description}</p>

          {/* Metadata */}
          <div className="text-gray-500 text-sm mt-4 space-y-2">
            <p>
              <span className="font-semibold">Level:</span>{" "}
              <Link
                to={`/search?category=all&query=${course.level}`}
                className="text-blue-500 hover:underline"
              >
                {course.level}
              </Link>
            </p>
            <p>
              <span className="font-semibold">Knowledge Area:</span>{" "}
              <Link
                to={`/search?category=all&query=${course.knowledgeArea}`}
                className="text-blue-500 hover:underline"
              >
                {course.knowledgeArea}
              </Link>
            </p>
            <p>
              <span className="font-semibold">Released Date:</span>{" "}
              {course.releasedDate}
            </p>
            <p>
              <span className="font-semibold">Rating:</span> {course.rating} ⭐
            </p>
            <p>
              <span className="font-semibold">Enrolled Students:</span>{" "}
              {course.numEnrolled}
            </p>
            <p>
              <span className="font-semibold">Course Owner:</span>{" "}
              <Link
                to={`/search?category=all&query=${course.owner}`}
                className="text-blue-500 hover:underline"
              >
                {course.owner}
              </Link>
            </p>
          </div>

          {/* Outline */}
          {hasOutline && (
            <div className="bg-gray-100 p-4 rounded-lg mt-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Course Outline
              </h2>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Modules:</span>{" "}
                {course.outline.modules}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Content Type:</span>{" "}
                {course.outline.contentType}
              </p>
              <h3 className="font-semibold text-gray-800 mt-4">
                Course Structure:
              </h3>
              <ul className="list-disc ml-5 text-gray-600">
                {course.outline.structure.map((module, index) => (
                  <li key={index}>{module}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Reviews */}
          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Reviews
            </h2>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="mb-4">
                  <p className="font-semibold text-gray-800">{review.user}</p>
                  <div className="flex items-center text-yellow-500">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-600 mt-2">{review.comment}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-3">
            {!status && (
              <button
                onClick={handleEnroll}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-md"
              >
                {loading ? "Enrolling..." : "Enroll Now"}
              </button>
            )}

            {status === "locked" && (
              <button
                className="w-full bg-gray-300 text-white py-3 px-6 rounded-md cursor-not-allowed"
                disabled
              >
                Locked 🔒 (Complete previous course to unlock)
              </button>
            )}

            {status === "unlocked" && (
              <>
                <button
                  onClick={() => navigate(`/courses/${courseId}/content`)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md"
                >
                  Go to Course Content
                </button>
                <button
                  onClick={handleComplete}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-md"
                >
                  Mark as Completed ✅
                </button>
              </>
            )}

            {status === "completed" && (
              <button
                className="w-full bg-green-700 text-white py-3 px-6 rounded-md cursor-not-allowed"
                disabled
              >
                Completed ✅
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default beforeAuthLayout(CoursePage);
