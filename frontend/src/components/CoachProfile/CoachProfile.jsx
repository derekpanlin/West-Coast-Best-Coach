import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useModal } from "../../context/Modal";
import {
  clearAvailability,
  fetchAvailabilityThunk,
} from "../../redux/availability";
import { fetchCoachById } from "../../redux/coach";
import {
  deleteReviewThunk,
  fetchReviewsByCoachThunk,
} from "../../redux/review";
import BookLessonModal from "../BookLessonModal";
import CoachAvailabilityModal from "../CoachAvailabilityModal";
import ReviewModal from "../ReviewModal";
import UpdateReviewModal from "../UpdateReviewModal.jsx";
import "./CoachProfile.css";

function CoachProfile() {
  const { coachId } = useParams();
  const dispatch = useDispatch();
  const { setModalContent, closeModal } = useModal();

  const coach = useSelector((state) => state.coach.coaches[coachId]);
  const reviews = useSelector((state) => state.reviews.coachReviews); // Select reviews from Redux state
  const currentUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(fetchCoachById(coachId));
    dispatch(fetchAvailabilityThunk(coachId));
    dispatch(fetchReviewsByCoachThunk(coachId));

    return () => {
      dispatch(clearAvailability(coachId));
    };
  }, [dispatch, coachId]);

  const handleViewAvailability = async (coach) => {
    await dispatch(fetchAvailabilityThunk(coach.id));
    setModalContent(
      <CoachAvailabilityModal
        coach={coach}
        onClose={() => {
          dispatch(clearAvailability(coach.id));
          closeModal();
        }}
      />
    );
  };

  const handleBookLesson = (coach) => {
    setModalContent(
      <BookLessonModal
        coach={coach}
        initialLesson={null}
        onClose={closeModal}
      />
    );
  };

  const handleWriteReview = (coach) => {
    setModalContent(<ReviewModal coach={coach} onClose={closeModal} />);
  };

  const handleUpdateReview = (review) => {
    setModalContent(<UpdateReviewModal review={review} onClose={closeModal} />);
  };

  const handleDeleteReview = (reviewId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (confirmation) {
      dispatch(deleteReviewThunk(reviewId));
    }
  };

  // Calculate the total number of reviews and the average rating
  const { totalReviews, averageRating } = useMemo(() => {
    const reviewsArray = Object.values(reviews);
    const totalReviews = reviewsArray.length;
    const averageRating =
      totalReviews > 0
        ? (
            reviewsArray.reduce((acc, review) => acc + review.rating, 0) /
            totalReviews
          ).toFixed(1)
        : 0;
    return { totalReviews, averageRating };
  }, [reviews]);

  if (!coach) {
    return <div>Loading...</div>;
  }

  return (
    <div className="coach-profile-container">
      <div className="coach-profile-content">
        <div className="coach-profile-left">
          <img
            src={coach.image_url}
            alt={`Coach ${coach.first_name}`}
            className="coach-profile-image"
          />
          <div className="coach-profile-details">
            <p>
              <strong>Rate:</strong> ${Number(coach.rate).toLocaleString()} /
              hour
            </p>
            <p>
              <strong>{coach.experience_years}+ years of experience</strong>
            </p>
            <button
              className="profile-btn view-availability-btn"
              onClick={() => handleViewAvailability(coach)}
            >
              View Availability
            </button>
            <button
              className="profile-btn book-lesson-btn"
              onClick={() => handleBookLesson(coach)}
            >
              Book A Lesson!
            </button>
            <button
              className="profile-btn write-review-btn"
              onClick={() => handleWriteReview(coach)}
            >
              Write a Review!
            </button>
          </div>
        </div>
        <div className="coach-profile-right">
          <div className="coach-profile-header">
            <h1>
              Coach {coach.first_name} {coach.last_name}
            </h1>
            <h2>Located in {coach.location}, California</h2>
          </div>
          <h3>Bio:</h3>
          <p>{coach.bio}</p>

          <div className="coach-reviews-summary">
            <p>
              <strong>
                {totalReviews} {totalReviews === 1 ? "Review" : "Reviews"}
                {totalReviews > 0 && <> · 🎾 {averageRating} </>}
              </strong>
            </p>
          </div>

          <div className="coach-reviews">
            <h3>Reviews:</h3>
            {totalReviews === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              Object.values(reviews)
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort by most recent
                .map((review) => (
                  <div key={review.id} className="review-item">
                    <p>
                      <strong>{review.user.username}:</strong> {review.comment}
                    </p>
                    <p>
                      <strong>Rating:</strong> {review.rating} 🎾
                    </p>
                    <p className="review-date">
                      <em>
                        Posted on{" "}
                        {new Date(review.created_at).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long" }
                        )}
                      </em>
                    </p>

                    {currentUser && currentUser.id === review.user_id && (
                      <div className="review-actions">
                        <button
                          id="review-update-btn"
                          onClick={() => handleUpdateReview(review)}
                        >
                          Update
                        </button>
                        <button onClick={() => handleDeleteReview(review.id)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoachProfile;
