import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { useAuth } from "../contexts/AuthContext";
import { dummyPathways } from "../Pages/dummyData";
import useReview from "../hooks/useReviews";

const PathwayPage = () => {
  const { pathwayId } = useParams();
  const navigate = useNavigate();
  const { loggedInUser, isLoggedIn, enrollInPathway, leavePathway } = useAuth();
  const { createReview, updateReview, deleteReviewById, getAllReviewsForCourse } = useReview();

  const [pathway, setPathway] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const [reviews, setReviews] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [reviewId, setReviewId] = useState(null);

  // ✅ Load pathway (dummy for now)
  useEffect(() => {
    setLoadingPage(true);
    setNotFound(false);

    const selectedPathway = dummyPathways.find(
      (p) => String(p.id) === String(pathwayId)
    );

    if (!selectedPathway) {
      setNotFound(true);
      setLoadingPage(false);
      return;
    }

    setPathway(selectedPathway);
    setLoadingPage(false);

    if (isLoggedIn && loggedInUser?.enrolledPathways) {
      setIsEnrolled(loggedInUser.enrolledPathways.includes(pathwayId));
    }
  }, [pathwayId, isLoggedIn, loggedInUser]);

  // ✅ Fetch reviews (reusing course review hooks)
  useEffect(() => {
    let mounted = true;
    getAllReviewsForCourse(pathwayId)
      .then((res) => {
        if (mounted) setReviews(res);
      })
      .catch((err) => {
        console.error("Failed to fetch reviews", err);
        if (mounted) setReviews(null);
      });
    return () => (mounted = false);
  }, [getAllReviewsForCourse, pathwayId]);

  // ---------- Loading / Not Found ----------
  if (loadingPage) {
    return (
      <div className="max-w-7xl mx-auto p-6 animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded mb-4" />
        <div className="h-4 w-96 bg-gray-200 rounded mb-6" />
        <div className="h-64 bg-gray-100 rounded-lg shadow" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-red-600 font-semibold">
        Pathway not found.
      </div>
    );
  }

  // ---------- Enroll / Leave ----------
  const handleEnroll = async () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/pathway/${pathwayId}` } });
      return;
    }
    setLoading(true);
    try {
      await enrollInPathway(pathwayId);
      setIsEnrolled(true);
      alert(`Successfully enrolled in ${pathway.name}`);
    } catch (error) {
      console.error("Error enrolling:", error);
      alert("Something went wrong while enrolling.");
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    if (window.confirm(`Are you sure you want to leave ${pathway.name}?`)) {
      setLoading(true);
      try {
        if (leavePathway) await leavePathway(pathwayId);
        else await enrollInPathway(pathwayId, { unenroll: true });
        setIsEnrolled(false);
        alert(`You have left ${pathway.name}`);
      } catch (error) {
        console.error("Error leaving pathway:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // ---------- Reviews ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("You must be logged in to leave a review.");
      return;
    }
    if (!rating || !comment.trim()) return;

    try {
      if (reviewId) {
        await updateReview(reviewId, { comment, rating, status: "active" });
        alert("Review updated!");
      } else {
        await createReview({
          rating,
          comment,
          userID: loggedInUser?.id,
          courseID: pathwayId, // same pattern
        });
        alert("Review submitted!");
      }
    } catch (err) {
      console.error("Failed to submit review", err);
    }

    setRating(0);
    setComment("");
    setIsEditing(false);
    setReviewId(null);
    const res = await getAllReviewsForCourse(pathwayId);
    setReviews(res);
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm("Delete your review?")) {
      try {
        await deleteReviewById(reviewId);
        alert("Review deleted.");
      } catch (err) {
        console.error("Failed to delete review", err);
      }
      setRating(0);
      setComment("");
      const res = await getAllReviewsForCourse(pathwayId);
      setReviews(res);
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
            src={pathway.img}
            alt={pathway.name}
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Info */}
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold text-gray-800">{pathway.name}</h1>
          <p className="text-gray-600 mt-3">{pathway.description}</p>

          <div className="text-gray-500 text-sm mt-4 space-y-2">
            <p>
              <span className="font-semibold">Courses Included:</span>{" "}
              {pathway.courses.length}
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
              {pathway.courses.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/courses/${c.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Reviews */}
          <div className="bg-white p-6 rounded-lg shadow mt-6">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>

            {isLoggedIn && isEnrolled ? (
              <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl ${rating >= star ? "text-yellow-500" : "text-gray-300"
                        }`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your feedback..."
                  className="w-full p-3 border border-gray-300 rounded-md mb-3 focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold"
                >
                  {reviewId ? "Update Review" : "Submit Review"}
                </button>
              </form>
            ) : !isLoggedIn ? (
              <p className="text-gray-500 mb-4">
                Please{" "}
                <Link to="/login" className="text-blue-500">
                  log in
                </Link>{" "}
                to leave a review.
              </p>
            ) : (
              <p className="text-gray-500 mb-4">
                You must be enrolled to leave a review.
              </p>
            )}

            {/* ✅ Reviews list with null-safety */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Student Reviews</h3>
              {!(reviews && reviews.reviews && reviews.reviews.length > 0) ? (
                <p className="text-gray-500">No reviews yet. Be the first!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.reviews.map((r) => (
                    <div
                      key={r.reviewID}
                      className="border rounded-md p-4 bg-gray-50 shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">
                          {"User name not sent in api"}
                        </span>
                        <span className="text-yellow-500">
                          {"★".repeat(r.rating)}
                          {"☆".repeat(5 - r.rating)}
                        </span>
                      </div>
                      <p className="text-gray-700">{r.comment}</p>
                      {isLoggedIn && r.userID === loggedInUser?.id && (
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() => {
                              setRating(r.rating);
                              setComment(r.comment);
                              setIsEditing(true);
                              setReviewId(r.reviewID);
                            }}
                            className="bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(r.reviewID)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
                  onClick={handleLeave}
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
