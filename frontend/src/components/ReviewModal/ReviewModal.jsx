import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { createReviewThunk } from '../../redux/review';
import { useModal } from '../../context/Modal';
import { useNavigate } from 'react-router-dom';
import './ReviewModal.css';

function ReviewModal({ coach }) {
    const [stars, setStars] = useState(0); // Star rating
    const [review, setReview] = useState(''); // Review comment
    const [buttonDisabled, setButtonDisabled] = useState(true); // Button state
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { closeModal } = useModal();

    const handleStarClick = (index) => {
        setStars(index + 1); // Set the star rating
        updateButtonState(review, index + 1);
    };

    const handleTextAreaChange = (e) => {
        setReview(e.target.value);
        updateButtonState(e.target.value, stars);
    };

    const updateButtonState = (text, rating) => {
        // Enable button if the review is at least 10 characters and a rating is selected
        setButtonDisabled(text.length < 10 || rating < 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const reviewData = {
            coach_id: coach.id,
            rating: stars,
            comment: review,
        };

        const result = await dispatch(createReviewThunk(reviewData));

        if (result) {
            closeModal(); // Close the modal after successful submission
        }
    };

    // Array to display the stars
    const starArray = Array.from({ length: 5 }, (_, index) => index);

    return (
        <div className="review-modal">
            <h2>Review Coach {coach.first_name}</h2>
            <textarea
                placeholder="Leave your review here..."
                value={review}
                onChange={handleTextAreaChange}
            />
            <div className="star-rating">
                {starArray.map((index) => (
                    <FontAwesomeIcon
                        key={index}
                        icon={faStar}
                        className={index < stars ? 'star-filled' : 'star-empty'}
                        onClick={() => handleStarClick(index)}
                    />
                ))}
                <span>{stars} Stars</span>
            </div>
            <button
                onClick={handleSubmit}
                disabled={buttonDisabled}
            >
                Submit Review
            </button>
            <button onClick={closeModal}>Cancel</button>
        </div>
    );
}

export default ReviewModal;
