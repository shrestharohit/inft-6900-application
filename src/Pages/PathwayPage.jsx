import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { useAuth } from "../contexts/AuthContext";
import useReview from "../hooks/useReviews";
import usePathwayApi from "../hooks/usePathwayApi";
import webdevremovebg from "../assets/Images/webdevremovebg.png";
import useCourseApi from "../hooks/useCourseApi";
import useEnrollment from "../hooks/useEnrollment";

const PathwayPage = () => {
  const { pathwayId } = useParams();
  const navigate = useNavigate();
  const { loggedInUser, isLoggedIn } = useAuth();
  const { enrollInPathway, leavePathway, getEnrolledPathwaysById } =
    useEnrollment();
  const { getReviewsForAllCoursesUnderPathway } = useReview();

  const [pathway, setPathway] = useState(null);
  const [coursesInPathway, setCoursesInPathway] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [reviews, setReviews] = useState([]);

  const { getPathwayDetails } = usePathwayApi();
  const { getAllCoursesInAPathway } = useCourseApi();

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const [pathwayData, coursesInPathway, enrolledPathwayData] =
          await Promise.all([
            getPathwayDetails(pathwayId),
            getAllCoursesInAPathway(pathwayId),
            getEnrolledPathwaysById(loggedInUser?.id),
          ]);
        if (mounted) {
          setPathway(pathwayData.pathway);
          setCoursesInPathway(coursesInPathway.courses);
          enrolledPathwayData.find(
            (x) => (x.pathwayID == pathwayId) == pathwayId
          );
          setIsEnrolled(
            !!enrolledPathwayData.find((x) => x.pathwayID == pathwayId)
          );
          setLoadingPage(false);
        }
      } catch (err) {
        console.error("Failed to load modules", err);
        if (mounted) console.log("Failed to load modules.");
      }
    };
    loadData();
    return () => (mounted = false);
  }, [getPathwayDetails, getAllCoursesInAPathway]);

  // ✅ Fetch reviews (reusing course review hooks)
  useEffect(() => {
    let mounted = true;
    getReviewsForAllCoursesUnderPathway(pathwayId)
      .then((res) => {
        if (mounted) setReviews(res);
      })
      .catch((err) => {
        console.error("Failed to fetch reviews", err);
        if (mounted) setReviews(null);
      });
    return () => (mounted = false);
  }, [getReviewsForAllCoursesUnderPathway, pathwayId]);

  if (loadingPage) {
    return (
      <div className="max-w-7xl mx-auto p-6 animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded mb-4" />
        <div className="h-4 w-96 bg-gray-200 rounded mb-6" />
        <div className="h-64 bg-gray-100 rounded-lg shadow" />
      </div>
    );
  }

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/pathway/${pathwayId}` } });
      return;
    }
    setLoading(true);
    await enrollInPathway(pathwayId, { userID: loggedInUser.id });
    alert(`Successfully enrolled in ${pathway.name}`);
    setLoading(false);
    setIsEnrolled(true);
  };

  const handleDisenroll = async () => {
    if (window.confirm(`Are you sure you want to leave ${pathway.name}?`)) {
      await leavePathway(pathwayId);
      setIsEnrolled(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Back */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 hover:underline"
        >
          &larr; Back
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Image */}
        <div className="flex-shrink-0 w-full md:w-1/3">
          <img
            src={webdevremovebg}
            alt={pathway.name}
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Info */}
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold text-gray-800">{pathway.name}</h1>
          <p className="text-gray-600 mt-3">{pathway.outline}</p>

          <div className="text-gray-500 text-sm mt-4 space-y-2">
            <p>
              <span className="font-semibold">Courses Included:</span>{" "}
              {coursesInPathway.length}
            </p>
            <p>
              <span className="font-semibold">Rating:</span>{" "}
              {reviews?.avgRating || 0} ⭐
            </p>
          </div>

          {/* Courses in Pathway */}
          <div className="bg-gray-100 p-4 rounded-lg mt-6 shadow">
            <h2 className="text-2xl font-semibold mb-3">
              Courses in this Pathway
            </h2>
            <ul className="list-disc ml-5 text-gray-600">
              {coursesInPathway.map((c) => (
                <li key={c.courseID}>
                  <Link
                    to={`/courses/${c.courseID}`}
                    className="text-blue-500 hover:underline"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Reviews */}
          <div className="bg-white p-6 rounded-lg shadow mt-6">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>

            {/* ✅ Reviews list with null-safety */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Student Reviews</h3>
              {!reviews.length ? (
                <p className="text-gray-500">No reviews yet. Be the first!</p>
              ) : (
                <>
                  {reviews.map((r, courseIndex) =>
                    r.reviews.map((review) => (
                      <div
                        key={review.reviewID}
                        className="border rounded-md p-4 mb-4 bg-gray-50 shadow-sm"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">
                            {review.firstName} {review.lastName}
                          </span>
                          <span className="text-yellow-500">
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          </div>

          {/* Enroll / Leave */}
          <div className="mt-6 flex flex-col gap-3">
            {!isEnrolled && (
              <button
                onClick={handleEnroll}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-md"
              >
                {loading ? "Enrolling..." : "Enroll in Pathway"}
              </button>
            )}

            {isEnrolled && (
              <>
                <button
                  onClick={() => navigate(`/pathway/${pathwayId}/content`)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md"
                >
                  Go to Pathway Content
                </button>
                <button
                  onClick={handleDisenroll}
                  disabled={loading}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-md"
                >
                  {loading ? "Leaving..." : "Leave Pathway"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default beforeAuthLayout(PathwayPage);
