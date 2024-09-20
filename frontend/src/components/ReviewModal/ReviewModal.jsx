import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { PiTennisBall } from "react-icons/pi";
import { BiSolidTennisBall } from "react-icons/bi";
import { createReviewThunk } from '../../redux/review';
import { useModal } from '../../context/Modal';
import './ReviewModal.css';

function ReviewModal({ coach }) {
    const [stars, setStars] = useState(0); // Star rating
    const [review, setReview] = useState(''); // Review comment
    const [buttonDisabled, setButtonDisabled] = useState(true); // Button state
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    // Handle when a user clicks a star (or tennis ball in this case)
    const handleStarClick = (index) => {
        setStars(index + 1); // Set the star rating based on index clicked
        updateButtonState(review, index + 1);
    };

    // Handle text area change
    const handleTextAreaChange = (e) => {
        setReview(e.target.value);
        updateButtonState(e.target.value, stars);
    };

    // Update button state (whether it's enabled or disabled)
    const updateButtonState = (text, rating) => {
        setButtonDisabled(text.length < 10 || rating < 1);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const reviewData = {
            coach_id: coach.id,
            rating: stars,
            comment: review,
        };

        const result = await dispatch(createReviewThunk(reviewData));

        if (result) {
            closeModal(); // Close modal after successful submission
        }
    };

    // Render the star (tennis ball) icons
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
                    <span key={index} onClick={() => handleStarClick(index)}>
                        {index < stars ? (
                            <BiSolidTennisBall className="star-filled" />
                        ) : (
                            <PiTennisBall className="star-empty" />
                        )}
                    </span>
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
