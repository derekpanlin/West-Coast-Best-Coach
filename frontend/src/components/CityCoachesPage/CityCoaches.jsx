import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoachesByCity } from '../../redux/coach';
import { Link, useParams } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import CoachAvailabilityModal from '../CoachAvailabilityModal';

const CityCoaches = () => {
    const { city } = useParams();
    const dispatch = useDispatch();
    const { setModalContent, closeModal } = useModal();

    const formattedCity = city.replace(/-/g, ' ');
    const capitalizedCity = formattedCity.charAt(0).toUpperCase() + formattedCity.slice(1);

    const coaches = useSelector(state =>
        Object.values(state.coach.coaches).filter(coach =>
            coach.location.toLowerCase() === city.replace(/-/g, ' ').toLowerCase()
        )
    );

    useEffect(() => {
        dispatch(fetchCoachesByCity(city.replace(/-/g, ' ')));
    }, [dispatch, city]);

    const handleViewAvailability = (coach) => {
        setModalContent(<CoachAvailabilityModal coach={coach} />);
    };

    return (
        <div>
            <h1>Coaches in {capitalizedCity}</h1>
            <div className="coach-list">
                {coaches.length > 0 ? (
                    coaches.map((coach) => (
                        <div key={coach.id} className="coach-card">
                            <div className="coach-info">
                                <img src={coach.image_url} alt={`Coach ${coach.first_name}`} className="coach-image" />
                                <div>
                                    <h3>Coach {coach.first_name} {coach.last_name}</h3>
                                    <p>Rate: ${coach.rate}</p>
                                    <p>Over {coach.experience_years} years of experience</p>
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
                    <p>No coaches available in {capitalizedCity}.</p>
                )}
            </div>
        </div>
    );
};

export default CityCoaches;
