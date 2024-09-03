import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchCoachById } from '../../redux/coach';
import { useModal } from '../../context/Modal';
import CoachAvailabilityModal from '../CoachAvailabilityModal';
import { fetchAvailabilityThunk, clearAvailability } from '../../redux/availability';
import './CoachProfile.css';

function CoachProfile() {
    const { coachId } = useParams();
    const dispatch = useDispatch();
    const { setModalContent, closeModal } = useModal();

    const coach = useSelector(state => state.coach.coaches[coachId]);

    useEffect(() => {
        dispatch(fetchCoachById(coachId));
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

    if (!coach) {
        return <div>Loading...</div>;
    }

    return (
        <div className="coach-profile-container">
            <div className="coach-profile-content">
                <div className="coach-profile-left">
                    <img src={coach.image_url} alt={`Coach ${coach.first_name}`} className="coach-profile-image" />
                    <div className="coach-profile-details">
                        <p><strong>Rate:</strong> ${coach.rate}</p>
                        <p><strong>Over {coach.experience_years} years of experience</strong></p>
                        <button className="profile-btn view-availability-btn" onClick={() => handleViewAvailability(coach)}>View Availability</button>
                        <button className="profile-btn book-lesson-btn">Book A Lesson!</button>
                        <button className="profile-btn write-review-btn">Write a Review!</button>
                    </div>
                </div>
                <div className="coach-profile-right">
                    <div className="coach-profile-header">
                        <h1>Coach {coach.first_name} {coach.last_name}</h1>
                        <h2>Located in {coach.location}, California</h2>
                    </div>
                    <h3>Bio:</h3>
                    <p>{coach.bio}</p>
                </div>
            </div>
        </div>
    );
}

export default CoachProfile;
