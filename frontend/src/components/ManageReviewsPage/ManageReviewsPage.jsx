import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviewsByUserThunk, deleteReviewThunk } from '../../redux/review'; // Import the thunk for fetching and deleting reviews
import { useModal } from '../../context/Modal';
import UpdateReviewModal from '../UpdateReviewModal.jsx';
import './ManageReviewsPage.css';

function ManageReviewsPage() {
    const dispatch = useDispatch();
    const { setModalContent, closeModal } = useModal();

    // Fetch reviews on component mount
    useEffect(() => {
        dispatch(fetchReviewsByUserThunk());
    }, [dispatch]);

    // Select user reviews from Redux state
    const userReviews = useSelector((state) => state.reviews.userReviews);

    // Handle Update Review button click
    const handleUpdateReview = (review) => {
        setModalContent(
            <UpdateReviewModal
                review={review}
                onClose={closeModal}
            />
        );
    };

    // Handle Delete Review button click
    const handleDeleteReview = (reviewId) => {
        const confirmation = window.confirm("Are you sure you want to delete this review?");
        if (confirmation) {
            dispatch(deleteReviewThunk(reviewId));
        }
    };

    return (
        <div className="manage-reviews-container">
            <h1>All Reviews</h1>
            <div className="reviews-list">
                {Object.values(userReviews).length === 0 ? (
                    <p>No reviews found</p>
                ) : (
                    Object.values(userReviews).map((review) => (
                        <div key={review.id} className="review-item">
                            <h3>Review for Coach {review.coach.first_name} {review.coach.last_name}</h3>
                            <p><strong>Rating:</strong> {review.rating} ★</p>
                            <p><strong>Comment:</strong> {review.comment}</p>
                            <p className="review-date">
                                <em>{new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</em>
                            </p>
                            <div className="review-actions">
                                <button
                                    id="review-update-btn"
                                    onClick={() => handleUpdateReview(review)}
                                >
                                    Update
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDeleteReview(review.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ManageReviewsPage;
