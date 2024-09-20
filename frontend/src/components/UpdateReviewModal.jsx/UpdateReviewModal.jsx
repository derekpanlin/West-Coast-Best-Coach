import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PiTennisBall } from "react-icons/pi";
import { BiSolidTennisBall } from "react-icons/bi";
import { updateReviewThunk } from '../../redux/review';
import { useModal } from '../../context/Modal';
import '../ReviewModal/ReviewModal.css';

function UpdateReviewModal({ review }) {
    const [stars, setStars] = useState(review.rating); // Set the current rating
    const [comment, setComment] = useState(review.comment); // Set the current comment
    const [buttonDisabled, setButtonDisabled] = useState(true); // Button state
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    useEffect(() => {
        // Enable button if the comment is at least 10 characters and a rating is selected
        setButtonDisabled(comment.length < 10 || stars < 1);
    }, [comment, stars]);

    const handleStarClick = (index) => {
        setStars(index + 1); // Set the star rating
    };

    const handleTextAreaChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedReviewData = {
            rating: stars,
            comment,
        };

        const result = await dispatch(updateReviewThunk(review.id, updatedReviewData));

        if (result) {
            closeModal();
        }
    };

    // Create an array for the 5 stars
    const starArray = Array.from({ length: 5 }, (_, index) => index);

    return (
        <div className="review-modal">
            <h2>Update Review for {review.coach.first_name}</h2>
            <textarea
                placeholder="Update your review..."
                value={comment}
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
                id='review-update-btn'
                onClick={handleSubmit}
                disabled={buttonDisabled}
            >
                Update Review
            </button>
            <button onClick={closeModal}>Cancel</button>
        </div>
    );
}

export default UpdateReviewModal;
