import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { useAuth } from "../contexts/AuthContext";
import useCourseApi from "../hooks/useCourseApi";
import webdevremovebg from "../assets/Images/webdevremovebg.png";
import useEnrollment from "../hooks/useEnrollment";
import useReview from "../hooks/useReviews";

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { loggedInUser, isLoggedIn } = useAuth();

  const [course, setCourse] = useState(null);
  const [courseFromApi, setCourseFromApi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasEnrolled, setHasEnrolled] = useState(false);

  const [reviews, setReviews] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingReview, setEditingReview] = useState(false); // user has submitted a review
  const [isEditing, setIsEditing] = useState(false); // user is actively editing
  const [reviewId, setReviewId] = useState(null);

  const { fetchCourse } = useCourseApi();
  const { enrollCourse, leaveCourse, getEnrolledCoursesById } = useEnrollment();
  const {
    createReview,
    updateReview,
    getAllReviewsForCourse,
    deleteReviewById,
  } = useReview();

  useEffect(() => {
    let mounted = true;
    fetchCourse(courseId)
      .then((res) => {
        if (mounted) setCourseFromApi(res);
      })
      .catch((err) => {
        console.error("Failed to fetch courses", err);
        if (mounted) setCourseFromApi([]);
      });

    return () => (mounted = false);
  }, [fetchCourse]);

  useEffect(() => {
    let mounted = true;
    getAllReviewsForCourse(courseId)
      .then((res) => {
        if (mounted) setReviews(res);
      })
      .catch((err) => {
        console.error("Failed to fetch courses", err);
        if (mounted) setReviews(null);
      });

    return () => (mounted = false);
  }, [getAllReviewsForCourse]);

  // ✅ Reusable function to fetch enrolled courses
  const fetchEnrolledCourses = async () => {
    if (!loggedInUser?.id) return;

    try {
      const res = await getEnrolledCoursesById(loggedInUser.id);
      res?.enrolments?.find(
        (enr) => enr.courseID == courseId && enr.status == "enrolled"
      )
        ? setHasEnrolled(true)
        : setHasEnrolled(false);
    } catch (err) {
      console.error("Failed to fetch enrolled courses", err);
    }
  };

  // ✅ Call on initial load
  useEffect(() => {
    fetchEnrolledCourses();
  }, [loggedInUser?.id]); // Only re-run if user ID changes

  if (!courseFromApi) return <div>Course not found!</div>;

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/courses/${courseId}` } });
      return;
    }
    setLoading(true);

    await enrollCourse(courseId, { userID: loggedInUser.id });
    alert(`Successfully enrolled in this course`);
    setLoading(false);
    setHasEnrolled(true);
  };

  const handleDisenroll = async () => {
    if (window.confirm(`Are you sure you want to leave this course?`)) {
      await leaveCourse(courseId, { userID: loggedInUser.id });
      setHasEnrolled(false);
    }
  };

  // Submit new or updated review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("You must be logged in to leave a review.");
      return;
    }
    if (!rating || !comment.trim()) return;

    try {
      if (reviewId) {
        updateReview(reviewId, { comment, rating, status: "active" });
        alert("Review updated!");
      } else {
        const newReview = {
          rating,
          comment,
          userID: loggedInUser?.id,
          courseID: courseId,
        };
        await createReview(newReview);
        alert("Review submitted!");
      }
    } catch (err) {
      console.error("Failed to submit review", err);
    }

    // Reset editing state
    setRating(0);
    setComment("");
    setIsEditing(false);
    setReviewId(null);
    const res = await getAllReviewsForCourse(courseId);
    setReviews(res);
  };

  const handleDelete = async (reviewId) => {
    if (
      window.confirm(
        "Are you sure you want to delete your review for this course?"
      )
    ) {
      try {
        await deleteReviewById(reviewId);
        alert("Your review has been deleted.");
      } catch (err) {
        console.error("Failed to delete review", err);
      }
      setRating(0);
      setComment("");
      const res = await getAllReviewsForCourse(courseId);
      setReviews(res);
    }
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
            src={webdevremovebg}
            alt={courseFromApi?.title || "Course Image"}
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Content */}
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold text-gray-800">
            {courseFromApi?.title || "Loading..."}
          </h1>
          {/* <p className="text-lg text-gray-600 mt-2">{course.description}</p> */}

          {/* Metadata */}
          <div className="text-gray-500 text-sm mt-4 space-y-2">
            <p>
              <span className="font-semibold">Level:</span>{" "}
              <Link
                to={`/search?category=all&query=${courseFromApi?.level}`}
                className="text-blue-500 hover:underline"
              >
                {courseFromApi?.level}
              </Link>
            </p>
            <p>
              <span className="font-semibold">Category:</span>{" "}
              <Link
                to={`/search?category=all&query=${courseFromApi?.category}`}
                className="text-blue-500 hover:underline"
              >
                {courseFromApi?.category}
              </Link>
            </p>
            <p>
              <span className="font-semibold">Released Date:</span>{" "}
              {courseFromApi?.created_at}
            </p>
            <p>
              <span className="font-semibold">Rating:</span>{" "}
              {reviews?.avgRating} ⭐
            </p>
            {/* <p>
              <span className="font-semibold">Enrolled Students:</span>{" "}
              {course.numEnrolled}
            </p> */}
            <p>
              <span className="font-semibold">Course Owner:</span>{" "}
              <Link
                to={`/search?category=all&query=${courseFromApi?.userDetail?.userID}`}
                className="text-blue-500 hover:underline"
              >
                {courseFromApi?.userDetail?.firstName}{" "}
                {courseFromApi?.userDetail?.lastName}
              </Link>
            </p>
          </div>

          {/* Outline */}
          {courseFromApi?.outline && (
            <div className="bg-gray-100 p-4 rounded-lg mt-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Course Outline
              </h2>
              <ul className="list-disc ml-5 text-gray-600">
                {courseFromApi?.outline}
              </ul>
            </div>
          )}

          {/* Reviews Section */}
          <div className="bg-white p-6 rounded-lg shadow mt-6">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>

            {/* Review Form */}
            {isLoggedIn && hasEnrolled ? (
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
                      disabled={
                        !reviews?.reviews?.find(
                          (r) => r.userID == loggedInUser?.id
                        ) || isEditing
                      }
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
                  disabled={
                    !reviews?.reviews?.find(
                      (r) => r.userID == loggedInUser?.id
                    ) || isEditing
                  }
                />

                {!reviews?.reviews?.find((r) => r.userID == loggedInUser?.id) ||
                isEditing ? (
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold"
                  >
                    {reviewId ? "Update Review" : "Submit Review"}
                  </button>
                ) : (
                  <p className="text-gray-500">
                    You have already submitted a review. You can update or
                    delete it below.
                  </p>
                )}
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

            {/* Reviews list */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Student Reviews</h3>
              {reviews?.reviews?.length === 0 ? (
                <p className="text-gray-500">No reviews yet. Be the first!</p>
              ) : (
                <div className="space-y-4">
                  {reviews?.reviews?.map((r) => (
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
                      <p className="text-xs text-gray-400">{r.created_at}</p>

                      {/* Update/Delete buttons only for logged-in user's review */}
                      {isLoggedIn && r.userID === loggedInUser?.id && (
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() => {
                              setRating(r.rating);
                              setComment(r.comment);
                              setIsEditing(true); // allow editing
                              setReviewId(r.reviewID);
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                          >
                            Update Review
                          </button>
                          <button
                            onClick={() => handleDelete(r.reviewID)}
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
            {!hasEnrolled && (
              <button
                onClick={handleEnroll}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-md"
              >
                {loading ? "Enrolling..." : "Enroll Now"}
              </button>
            )}
            {/* {hasEnrolled && (
              <button
                className="w-full bg-gray-300 text-white py-3 px-6 rounded-md cursor-not-allowed"
                disabled
              >
                Locked 🔒 (Complete previous course to unlock)
              </button>
            )} */}
            {hasEnrolled && (
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
            {/* {completionDate && (
              <button
                className="w-full bg-green-700 text-white py-3 px-6 rounded-md cursor-not-allowed"
                disabled
              >
                Completed ✅
              </button>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default beforeAuthLayout(CoursePage);
