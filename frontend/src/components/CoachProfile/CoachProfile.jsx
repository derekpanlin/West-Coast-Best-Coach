// import { useParams } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { useEffect } from 'react';
// import { fetchCoachById } from '../../redux/coach';
// import { useModal } from '../../context/Modal';
// import CoachAvailabilityModal from '../CoachAvailabilityModal';
// import { fetchReviewsByCoachThunk } from '../../redux/review';
// import { fetchAvailabilityThunk, clearAvailability } from '../../redux/availability';
// import BookLessonModal from '../BookLessonModal';
// import ReviewModal from '../ReviewModal/ReviewModal';
// import './CoachProfile.css';

// function CoachProfile() {
//     const { coachId } = useParams();
//     const dispatch = useDispatch();
//     const { setModalContent, closeModal } = useModal();

//     const coach = useSelector(state => state.coach.coaches[coachId]);
//     const reviews = useSelector(state => state.reviews.coachReviews)

//     useEffect(() => {
//         dispatch(fetchCoachById(coachId));
//         dispatch(fetchAvailabilityThunk(coachId));
//         return () => {
//             dispatch(clearAvailability(coachId)); // Clear availability on unmount
//         };
//     }, [dispatch, coachId]);

//     const handleViewAvailability = async (coach) => {
//         await dispatch(fetchAvailabilityThunk(coach.id));
//         setModalContent(
//             <CoachAvailabilityModal
//                 coach={coach}
//                 onClose={() => {
//                     dispatch(clearAvailability(coach.id));
//                     closeModal();
//                 }}
//             />
//         );
//     };

//     const handleBookLesson = (coach) => {
//         setModalContent(
//             <BookLessonModal
//                 coach={coach}
//                 initialLesson={null}
//                 onClose={closeModal}
//             />
//         )
//     }

//     const handleWriteReview = (coach) => {
//         setModalContent(
//             <ReviewModal
//                 coach={coach}
//                 onClose={closeModal}
//                 refreshReviews={() => dispatch(fetchReviewsByCoachThunk(coach.id))} // Refresh reviews after submission
//             />
//         )
//     }

//     // Calculate the total number of reviews and the average rating
//     const { totalReviews, averageRating } = useMemo(() => {
//         const reviewsArray = Object.values(reviews);
//         const totalReviews = reviewsArray.length;
//         const averageRating = totalReviews > 0
//             ? (reviewsArray.reduce((acc, review) => acc + review.rating, 0) / totalReviews).toFixed(1)
//             : 0;
//         return { totalReviews, averageRating };
//     }, [reviews]);

//     if (!coach) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="coach-profile-container">
//             <div className="coach-profile-content">
//                 <div className="coach-profile-left">
//                     <img src={coach.image_url} alt={`Coach ${coach.first_name}`} className="coach-profile-image" />
//                     <div className="coach-profile-details">
//                         <p><strong>Rate:</strong> ${coach.rate} / hour</p>
//                         <p><strong>{coach.experience_years}+ years of experience</strong></p>
//                         <button className="profile-btn view-availability-btn" onClick={() => handleViewAvailability(coach)}>View Availability</button>
//                         <button className="profile-btn book-lesson-btn" onClick={() => handleBookLesson(coach)}>Book A Lesson!</button>
//                         <button className="profile-btn write-review-btn" onClick={() => handleWriteReview(coach)}>Write a Review!</button>
//                     </div>
//                 </div>
//                 <div className="coach-profile-right">
//                     <div className="coach-profile-header">
//                         <h1>Coach {coach.first_name} {coach.last_name}</h1>
//                         <h2>Located in {coach.location}, California</h2>
//                     </div>
//                     <h3>Bio:</h3>
//                     <p>{coach.bio}</p>

//                     <div className='coach-reviews-section'>
//                         <h3>Reviews:</h3>
//                         {Object.values(reviews).length > 0 ? (
//                             Object.values(reviews)
//                                 .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort by most recent
//                                 .map(review => (
//                                     <div key={review.id} className="review-item">
//                                         <p><strong>{review.user.username}:</strong> {review.comment}</p>
//                                         <p>Rating: {review.rating} / 5</p>
//                                         <p><em>{new Date(review.created_at).toLocaleString()}</em></p>
//                                     </div>
//                                 ))
//                         ) : (
//                             <p>No reviews yet. Be the first to review!</p>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default CoachProfile;

import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { fetchCoachById } from '../../redux/coach';
import { useModal } from '../../context/Modal';
import { fetchAvailabilityThunk, clearAvailability } from '../../redux/availability';
import { fetchReviewsByCoachThunk } from '../../redux/review'; // Import review thunk
import CoachAvailabilityModal from '../CoachAvailabilityModal';
import BookLessonModal from '../BookLessonModal';
import ReviewModal from '../ReviewModal'; // Import the Review Modal
import './CoachProfile.css';

function CoachProfile() {
    const { coachId } = useParams();
    const dispatch = useDispatch();
    const { setModalContent, closeModal } = useModal();

    const coach = useSelector(state => state.coach.coaches[coachId]);
    const reviews = useSelector(state => state.reviews.coachReviews); // Select reviews from Redux state

    useEffect(() => {
        dispatch(fetchCoachById(coachId));
        dispatch(fetchAvailabilityThunk(coachId));
        dispatch(fetchReviewsByCoachThunk(coachId)); // Fetch reviews by coach

        return () => {
            dispatch(clearAvailability(coachId)); // Clear availability on unmount
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
        setModalContent(
            <ReviewModal
                coach={coach}
                onClose={closeModal}
            />
        );
    };

    // Calculate the total number of reviews and the average rating
    const { totalReviews, averageRating } = useMemo(() => {
        const reviewsArray = Object.values(reviews);
        const totalReviews = reviewsArray.length;
        const averageRating = totalReviews > 0
            ? (reviewsArray.reduce((acc, review) => acc + review.rating, 0) / totalReviews).toFixed(1)
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
                    <img src={coach.image_url} alt={`Coach ${coach.first_name}`} className="coach-profile-image" />
                    <div className="coach-profile-details">
                        <p><strong>Rate:</strong> ${coach.rate} / hour</p>
                        <p><strong>{coach.experience_years}+ years of experience</strong></p>
                        <button className="profile-btn view-availability-btn" onClick={() => handleViewAvailability(coach)}>View Availability</button>
                        <button className="profile-btn book-lesson-btn" onClick={() => handleBookLesson(coach)}>Book A Lesson!</button>
                        <button className="profile-btn write-review-btn" onClick={() => handleWriteReview(coach)}>Write a Review!</button>
                    </div>
                </div>
                <div className="coach-profile-right">
                    <div className="coach-profile-header">
                        <h1>Coach {coach.first_name} {coach.last_name}</h1>
                        <h2>Located in {coach.location}, California</h2>
                    </div>
                    <h3>Bio:</h3>
                    <p>{coach.bio}</p>

                    <div className="coach-reviews-summary">
                        <p>
                            <strong>
                                {totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}
                                {totalReviews > 0 && (
                                    <> · ★ {averageRating} </>
                                )}
                            </strong>
                        </p>
                    </div>


                    {/* Display reviews */}
                    <div className="coach-reviews">
                        <h3>Reviews:</h3>
                        {totalReviews === 0 ? (
                            <p>No reviews yet.</p>
                        ) : (
                            Object.values(reviews)
                                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort by most recent
                                .map(review => (
                                    <div key={review.id} className="review-item">
                                        <p><strong>{review.user.username}:</strong> {review.comment}</p>
                                        <p><strong>Rating:</strong> {review.rating} ★</p>
                                        <p className="review-date"><em>{new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</em></p>
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
