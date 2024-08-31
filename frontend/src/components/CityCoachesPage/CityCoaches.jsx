import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCoachesByCity } from '../../redux/coach'
import { Link, useParams } from 'react-router-dom'

const CityCoaches = () => {
    const { city } = useParams();
    const dispatch = useDispatch();

    const formattedCity = city.replace(/-/g, ' ');
    const capitalizedCity = formattedCity.charAt(0).toUpperCase() + formattedCity.slice(1);

    // Make sure its lowercase to match the filtering
    const coaches = useSelector(state =>
        Object.values(state.coach.coaches).filter(coach =>
            coach.location.toLowerCase() === city.replace(/-/g, ' ').toLowerCase()
        )
    );

    useEffect(() => {
        dispatch(fetchCoachesByCity(city.replace(/-/g, ' ')));
    }, [dispatch, city])

    return (
        <div>
            <h1>Coaches in {capitalizedCity}</h1>
            <div className="coach-list">
                {coaches.length > 0 ? (
                    coaches.map((coach) => (
                        <div key={coach.id} className="coach-card">
                            <h3>{coach.first_name} {coach.last_name}</h3>
                            <p>Rate: ${coach.rate}</p>
                            <p>Availability: {coach.availability}</p>
                            <Link to={`/coaches/${coach.id}`}>View Profile</Link>
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
