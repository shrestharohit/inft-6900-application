import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { useAuth } from "../contexts/AuthContext";
import { dummyPathways } from "../Pages/dummyData"; // ✅ central import

const PathwayPage = () => {
  const { pathwayId } = useParams();
  const navigate = useNavigate();
  const { loggedInUser, isLoggedIn, enrollInPathway } = useAuth();

  const [pathway, setPathway] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const selectedPathway = dummyPathways.find((p) => p.id === pathwayId);
    setPathway(selectedPathway);

    if (isLoggedIn && loggedInUser?.enrolledPathways) {
      setIsEnrolled(loggedInUser.enrolledPathways.includes(pathwayId));
    }
  }, [pathwayId, isLoggedIn, loggedInUser]);

  if (!pathway) {
    return <div>Pathway not found!</div>;
  }

  const handleEnroll = () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/pathway/${pathwayId}` } });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      enrollInPathway(pathwayId);
      setIsEnrolled(true);
      alert(`Successfully enrolled in ${pathway.name}`);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => {
            if (window.history.state && window.history.state.idx > 0) {
              navigate(-1);
            } else {
              navigate("/search"); // fallback if no history
            }
          }}
          className="text-sm text-gray-600 hover:underline"
        >
          &larr; Back
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Pathway Image */}
        <div className="md:w-1/3">
          <img
            src={pathway.img}
            alt={pathway.name}
            className="w-full h-72 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Pathway Info */}
        <div className="md:w-2/3">
          <h1 className="text-4xl font-extrabold text-gray-900">{pathway.name}</h1>
          <p className="text-lg text-gray-600 mt-4">{pathway.description}</p>

          <div className="text-gray-500 text-sm mt-6 space-y-2">
            <p>
              <span className="font-semibold">Courses Included:</span>{" "}
              {pathway.courses.length}
            </p>
            <p>
              <span className="font-semibold">Rating:</span> {pathway.rating} ⭐
            </p>
          </div>

          {/* Courses in Pathway */}
          <div className="bg-gray-100 p-6 rounded-lg mt-6 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Courses in this Pathway
            </h2>
            <ul className="list-disc ml-6 text-gray-600">
              {pathway.courses.map((course) => (
                <li key={course.id}>
                  <Link
                    to={`/courses/${course.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {course.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Outline */}
          {pathway.outline && (
            <div className="bg-gray-100 p-6 rounded-lg mt-6 shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Pathway Outline
              </h2>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Modules:</span>{" "}
                {pathway.outline.modules}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Content Type:</span>{" "}
                {pathway.outline.contentType}
              </p>
              <h3 className="font-semibold text-gray-800 mt-4">Structure:</h3>
              <ul className="list-disc ml-5 text-gray-600">
                {pathway.outline.structure.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Reviews */}
          <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reviews</h2>
            {pathway.reviews.length > 0 ? (
              pathway.reviews.map((review, index) => (
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

          {/* Enroll / Already Enrolled */}
          <div className="mt-6 flex flex-col gap-3">
            {isEnrolled ? (
              <>
                <button
                  className="w-full bg-gray-400 text-white py-3 px-6 rounded-md cursor-not-allowed"
                  disabled
                >
                  You are already enrolled
                </button>
                <button
                  onClick={() => navigate(`/pathway/${pathwayId}/content`)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md"
                >
                  Go to Pathway Content
                </button>
              </>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-md"
              >
                {loading ? "Enrolling..." : "Enroll in Pathway"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default beforeAuthLayout(PathwayPage);
