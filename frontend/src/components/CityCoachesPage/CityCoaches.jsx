import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoachesByCity, clearCoaches } from '../../redux/coach';
import { fetchAvailabilityThunk, clearAvailability } from '../../redux/availability';
import { Link, useParams } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import CoachAvailabilityModal from '../CoachAvailabilityModal';
import './CityCoaches.css'


const CityCoaches = () => {
    const { city } = useParams();
    const dispatch = useDispatch();
    const { setModalContent, closeModal } = useModal();

    const formattedCity = city.replace(/-/g, ' ');
    const capitalizedCity = formattedCity.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const coaches = useSelector(state =>
        Object.values(state.coach.coaches).filter(coach =>
            coach.location.toLowerCase() === city.replace(/-/g, ' ').toLowerCase()
        )
    );

    useEffect(() => {
        // Fetch coaches by city
        dispatch(fetchCoachesByCity(city.replace(/-/g, ' ')));

        // Clear coaches on unmount
        return () => {
            dispatch(clearCoaches());
        };
    }, [dispatch, city]);

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

    const sortedCoaches = coaches.sort((a, b) => a.rate - b.rate)


    return (
        <div>
            <h1>Coaches in {capitalizedCity}</h1>
            <div className="coach-list">
                {sortedCoaches.length > 0 ? (
                    sortedCoaches.map((coach) => (
                        <div key={coach.id} className="coach-card">
                            <div className="coach-info">
                                <img src={coach.image_url} alt={`Coach ${coach.first_name}`} className="coach-image" />
                                <div>
                                    <h3>Coach {coach.first_name} {coach.last_name}</h3>
                                    <p><strong>Rate</strong>: ${coach.rate} / hour</p>
                                    <p>{coach.experience_years}+ years of experience</p>
                                </div>
                            </div>
                            <div className="coach-actions">
                                <Link to={`/coaches/${coach.id}`} className="view-profile-btn">View Profile</Link>
                                <button className="view-availability-btn" onClick={() => handleViewAvailability(coach)}>
                                    View Availability
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p id='no-coaches-available'>No coaches available in {capitalizedCity}.</p>
                )}
            </div>
        </div>
    );
};

export default CityCoaches;
