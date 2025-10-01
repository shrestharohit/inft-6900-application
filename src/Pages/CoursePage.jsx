import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { useAuth } from "../contexts/AuthContext";
import { dummyCourses } from "../Pages/dummyData";

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { loggedInUser, isLoggedIn, enrollInCourse, disenrollFromCourse } =
    useAuth();

  const [course, setCourse] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingReview, setEditingReview] = useState(false); // user has submitted a review
  const [isEditing, setIsEditing] = useState(false); // user is actively editing
  const [currentUserReviewId, setCurrentUserReviewId] = useState(null);

  // Load course and reviews
  useEffect(() => {
    const selectedCourse = dummyCourses.find((c) => c.id === courseId);
    setCourse(selectedCourse);

    if (selectedCourse) {
      const savedReviews =
        JSON.parse(localStorage.getItem(`reviews_${courseId}`)) ||
        selectedCourse.reviews ||
        [];
      setReviews(savedReviews);

      // Check if logged-in user already has a review
      if (isLoggedIn && loggedInUser) {
        const existingReview = savedReviews.find(
          (r) => r.user === loggedInUser.firstName
        );
        if (existingReview) {
          setRating(existingReview.rating);
          setComment(existingReview.comment);
          setEditingReview(true);   // review exists
          setIsEditing(false);      // not actively editing yet
          setCurrentUserReviewId(existingReview.id);
        } else {
          setRating(0);
          setComment("");
          setEditingReview(false);
        }
      }
    }

    if (isLoggedIn && loggedInUser?.enrolledCourses) {
      setStatus(loggedInUser.enrolledCourses[courseId]?.status || null);
    } else {
      setStatus(null);
    }
  }, [courseId, isLoggedIn, loggedInUser]);

  // Recalculate average rating
  useEffect(() => {
    if (reviews.length > 0) {
      const avg =
        reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
      setAvgRating(avg.toFixed(1));
    } else {
      setAvgRating(course?.rating || 0);
    }
  }, [reviews, course]);

  if (!course) return <div>Course not found!</div>;

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

  const handleDisenroll = () => {
    if (window.confirm(`Are you sure you want to leave ${course.name}?`)) {
      disenrollFromCourse(courseId);
      setStatus(null);
      alert(`You have left ${course.name}`);
      navigate("/search");
    }
  };

  // Submit new or updated review
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("You must be logged in to leave a review.");
      return;
    }
    if (!rating || !comment.trim()) return;

    const newReview = {
      id: currentUserReviewId || Date.now(),
      rating,
      comment,
      user: loggedInUser?.firstName || "Anonymous User",
      createdAt: new Date().toLocaleString(),
    };

    let updatedReviews;
    if (editingReview) {
      // Update existing review
      updatedReviews = reviews.map((r) =>
        r.user === newReview.user ? newReview : r
      );
      alert("Review updated!");
    } else {
      // Add new review
      updatedReviews = [newReview, ...reviews];
      setEditingReview(true);
      alert("Review submitted!");
    }

    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${courseId}`, JSON.stringify(updatedReviews));

    // Reset editing state
    setIsEditing(false);
    setCurrentUserReviewId(newReview.id);
  };

  const handleDelete = (user) => {
    if (window.confirm("Are you sure you want to delete your review for this course?")) {
      const updatedReviews = reviews.filter((r) => r.user !== user);
      setReviews(updatedReviews);
      localStorage.setItem(`reviews_${courseId}`, JSON.stringify(updatedReviews));
      if (user === loggedInUser?.firstName) {
        setRating(0);
        setComment("");
        setEditingReview(false);
        setIsEditing(false);
        setCurrentUserReviewId(null);
      }
      alert("Your review has been deleted.");
    }
  };

  const hasOutline = course.outline && course.outline.modules;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => {
            if (window.history.state && window.history.state.idx > 0) {
              navigate(-1);
            } else {
              navigate("/search");
            }
          }}
          className="text-sm text-gray-600 hover:underline"
        >
          &larr; Back
        </button>
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
              <span className="font-semibold">Rating:</span> {avgRating} ⭐
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
              <ul className="list-disc ml-5 text-gray-600">
                {course.outline.structure.map((module, index) => (
                  <li key={index}>{module}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Reviews Section */}
          <div className="bg-white p-6 rounded-lg shadow mt-6">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>

            {/* Review Form */}
            {isLoggedIn && status === "unlocked" ? (
              <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl ${
                        rating >= star ? "text-yellow-500" : "text-gray-300"
                      }`}
                      disabled={editingReview && !isEditing}
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
                  disabled={editingReview && !isEditing}
                />

                {!editingReview || isEditing ? (
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold"
                  >
                    {editingReview ? "Update Review" : "Submit Review"}
                  </button>
                ) : (
                  <p className="text-gray-500">
                    You have already submitted a review. You can update or delete it below.
                  </p>
                )}
              </form>
            ) : !isLoggedIn ? (
              <p className="text-gray-500 mb-4">
                Please <Link to="/login" className="text-blue-500">log in</Link> to leave a review.
              </p>
            ) : (
              <p className="text-gray-500 mb-4">
                You must be enrolled to leave a review.
              </p>
            )}

            {/* Reviews list */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Student Reviews</h3>
              {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet. Be the first!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div
                      key={r.id}
                      className="border rounded-md p-4 bg-gray-50 shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{r.user}</span>
                        <span className="text-yellow-500">
                          {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                        </span>
                      </div>
                      <p className="text-gray-700">{r.comment}</p>
                      <p className="text-xs text-gray-400">{r.createdAt}</p>

                      {/* Update/Delete buttons only for logged-in user's review */}
                      {isLoggedIn && r.user === loggedInUser?.firstName && (
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() => {
                              setRating(r.rating);
                              setComment(r.comment);
                              setIsEditing(true); // allow editing
                              setCurrentUserReviewId(r.id);
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                          >
                            Update Review
                          </button>
                          <button
                            onClick={() => handleDelete(r.user)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                          >
                            Delete Review
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                  onClick={handleDisenroll}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-md"
                >
                  Leave Course
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
