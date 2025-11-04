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
  const userRole = loggedInUser?.role;

  const [courseFromApi, setCourseFromApi] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [loading, setLoading] = useState(false);
  const [hasEnrolled, setHasEnrolled] = useState(false);
  const [enrolmentID, setEnrolmentID] = useState(null);

  const [reviews, setReviews] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [reviewId, setReviewId] = useState(null);

  const { fetchCourse } = useCourseApi();
  const { enrollCourse, leaveCourse, getEnrolledCoursesById } = useEnrollment();
  const {
    createReview,
    updateReview,
    getAllReviewsForCourse,
    deleteReviewById,
  } = useReview();

  // ✅ Sydney-local time helpers
  const normalizeToDate = (ts) => {
    if (!ts) return null;
    if (ts instanceof Date) return ts;

    if (typeof ts === "number") {
      const ms = ts > 1e12 ? ts : ts * 1000;
      return new Date(ms);
    }

    if (typeof ts === "string") {
      let s = ts.trim();
      if (s.includes(" ") && !s.includes("T")) s = s.replace(" ", "T");
      // ⚠️ Do NOT add "Z" — treat as local Sydney time
      const d = new Date(s);
      return isNaN(d) ? null : d;
    }

    const d = new Date(ts);
    return isNaN(d) ? null : d;
  };

  const formatDateTime = (ts) => {
    const date = normalizeToDate(ts);
    if (!date) return "";
    return new Intl.DateTimeFormat("en-AU", {
      timeZone: "Australia/Sydney",
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  // ✅ Fetch course info
  useEffect(() => {
    let mounted = true;
    setLoadingCourse(true);
    setNotFound(false);

    fetchCourse(courseId)
      .then((res) => {
        if (!mounted) return;
        const valid = res && (res.courseID || res.id) && (res.title || res.name);
        if (!valid) {
          setNotFound(true);
          setCourseFromApi(null);
        } else {
          setCourseFromApi(res);
        }
        setLoadingCourse(false);
      })
      .catch((err) => {
        console.error("Failed to fetch course", err);
        if (mounted) {
          if (err?.response?.status === 404) setNotFound(true);
          setLoadingCourse(false);
        }
      });

    return () => (mounted = false);
  }, [fetchCourse, courseId]);

  // get enrolment ID
  useEffect(() => {
    let mounted = true;
    getEnrolledCoursesById(loggedInUser?.id)
      .then((resp) => {
        const activeEnrollment = resp?.enrolments?.find((x) => x.courseID == courseId);
        if (mounted) setEnrolmentID(activeEnrollment?.enrolmentID);
      })
      .catch((err) => {
        console.error("Failed to fetch enrollment", err);
        if (mounted) setEnrolmentID(null);
      });
    return () => (mounted = false);
  }, [getEnrolledCoursesById, loggedInUser, courseId]);

  // ✅ Fetch course reviews
  useEffect(() => {
    let mounted = true;
    getAllReviewsForCourse(courseId)
      .then((res) => {
        if (mounted) {
          setReviews(res);
          const userReview = res?.reviews?.find(
            (r) => r.userID === loggedInUser?.id
          );
          if (userReview) {
            setIsEditing(false);
            setReviewId(userReview.reviewID);
            setRating(userReview.rating);
            setComment(userReview.comment);
          } else {
            setReviewId(null);
            setRating(0);
            setComment("");
          }
        }
      })
      .catch((err) => {
        console.error("Failed to fetch reviews", err);
        if (mounted) setReviews(null);
      });

    return () => (mounted = false);
  }, [getAllReviewsForCourse, courseId, loggedInUser?.id]);


  // ✅ Check if user already enrolled
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

  useEffect(() => {
    fetchEnrolledCourses();
  }, [loggedInUser?.id]);

  // ✅ Loading & not found states
  if (loadingCourse) {
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
        Course not found.
      </div>
    );
  }

  // ✅ Enroll / Disenroll
  const handleEnroll = async () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/courses/${courseId}` } });
      return;
    }
    setLoading(true);
    await enrollCourse(courseId, { userID: loggedInUser.id });
    alert("Successfully enrolled in this course");
    setLoading(false);
    setHasEnrolled(true);
  };

  const handleDisenroll = async () => {
    if (window.confirm("Are you sure you want to leave this course?")) {
      await leaveCourse(courseId, { userID: loggedInUser.id });
      setHasEnrolled(false);
    }
  };

  // ✅ Review submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("You must be logged in to leave a review.");
      return;
    }
    if (!rating || !comment.trim()) return;

    try {
      if (reviewId && isEditing) {
        await updateReview(reviewId, { comment, rating, status: "active" });
        alert("✅ Review updated!");
        setIsEditing(false);
      } else if (!reviewId) {
        const newReview = {
          rating,
          comment,
          enrolmentID: enrolmentID,
        };
        await createReview(newReview);
        alert("✅ Review submitted!");
      }

      const res = await getAllReviewsForCourse(courseId);
      setReviews(res);
      const userReview = res?.reviews?.find(
        (r) => r.userID === loggedInUser?.id
      );
      if (userReview) {
        setReviewId(userReview.reviewID);
        setRating(userReview.rating);
        setComment(userReview.comment);
      }
    } catch (err) {
      console.error("Failed to submit review", err);
    }
  };


  const capitalizeFirst = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };



  const handleDelete = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete your review?")) {
      try {
        await deleteReviewById(reviewId);
        alert("Your review has been deleted.");
      } catch (err) {
        console.error("Failed to delete review", err);
      }
      const res = await getAllReviewsForCourse(courseId);
      setReviews(res);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 🔶 Admin Banner */}
      {userRole === "admin" && (
        <div className="bg-yellow-100 text-yellow-800 text-center py-2 font-medium rounded-md mb-4">
          You are viewing this course as an <b>Administrator</b>. Enrollment is disabled.
        </div>
      )}

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

          {/* Metadata */}
          <div className="text-gray-500 text-sm mt-4 space-y-2">
            <p>
              <span className="font-semibold">Level:</span>{" "}
              <Link
                to={`/search?category=all&query=${courseFromApi?.level}`}
                className="text-blue-500 hover:underline"
              >
                {capitalizeFirst(courseFromApi?.level)}
              </Link>
            </p>

            <p>
              <span className="font-semibold">Category:</span>{" "}
              <Link
                to={`/search?category=all&query=${courseFromApi?.category}`}
                className="text-blue-500 hover:underline"
              >
                {capitalizeFirst(courseFromApi?.category)}
              </Link>
            </p>

            <p>
              <span className="font-semibold">Released Date:</span>{" "}
              {formatDateTime(courseFromApi?.created_at)}
            </p>
            <p>
              <span className="font-semibold">Rating:</span>{" "}
              {reviews?.avgRating} ⭐
            </p>
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

            {/* ✅ Only show review form if user hasn’t posted yet */}
            {isLoggedIn && hasEnrolled && userRole !== "admin" && !reviewId && (
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
                  Submit Review
                </button>
              </form>
            )}

            {!isLoggedIn && (
              <p className="text-gray-500 mb-4">
                Please{" "}
                <Link to="/login" className="text-blue-500">
                  log in
                </Link>{" "}
                to leave a review.
              </p>
            )}

            {isLoggedIn && hasEnrolled && reviewId && !isEditing && (
              <div className="mb-4 text-sm text-gray-500 italic">
                You’ve already reviewed this course. Edit or delete your review below.
              </div>
            )}

            {/* ✅ Reviews List */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Student Reviews</h3>
              {reviews?.reviews?.length === 0 ? (
                <p className="text-gray-500">No reviews yet. Be the first!</p>
              ) : (
                <div className="space-y-4">
                  {reviews?.reviews?.map((r) => {
                    const isUserReview = r.userID === loggedInUser?.id;
                    return (
                      <div
                        key={r.reviewID}
                        className={`border rounded-md p-4 shadow-sm ${isUserReview ? "bg-yellow-50 border-yellow-200" : "bg-gray-50"
                          }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">
                            {r.firstName} {r.lastName}
                            {isUserReview && (
                              <span className="ml-2 text-xs bg-yellow-200 text-gray-800 px-2 py-0.5 rounded-full">
                                Your Review
                              </span>
                            )}
                          </span>
                          <span className="text-yellow-500">
                            {"★".repeat(r.rating)}
                            {"☆".repeat(5 - r.rating)}
                          </span>
                        </div>

                        {/* ✅ Edit mode for the user's review */}
                        {isUserReview && isEditing ? (
                          <>
                            <div className="flex gap-2 mb-2">
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
                              className="w-full p-3 border border-gray-300 rounded-md mb-3 focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={handleSubmit}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setIsEditing(false);
                                  setRating(r.rating);
                                  setComment(r.comment);
                                }}
                                className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-md text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Normal (read-only) display */}
                            <p className="text-gray-700 mb-1">{r.comment}</p>
                            <p className="text-xs text-gray-400">
                              {formatDateTime(r.created_at)}
                            </p>

                            {isUserReview && (
                              <div className="mt-2 flex gap-2">
                                <button
                                  onClick={() => {
                                    setRating(r.rating);
                                    setComment(r.comment);
                                    setIsEditing(true);
                                    setReviewId(r.reviewID);
                                  }}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(r.reviewID)}
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>


          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-3">
            {/* 🧑‍🎓 Student Actions */}
            {userRole !== "admin" && !hasEnrolled && (
              <button
                onClick={handleEnroll}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-md"
              >
                {loading ? "Enrolling..." : "Enroll Now"}
              </button>
            )}

            {userRole !== "admin" && hasEnrolled && (
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

            {/* 🧑‍💼 Admin Action */}
            {userRole === "admin" && (
              <button
                onClick={() => navigate(`/courses/${courseId}/content`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md"
              >
                View Full Course Content
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default beforeAuthLayout(CoursePage);
