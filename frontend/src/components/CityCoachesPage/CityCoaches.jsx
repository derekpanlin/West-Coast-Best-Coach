import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCoachesByCity } from '../../redux/coach'
import { Link, useParams } from 'react-router-dom'

const CityCoaches = () => {
    const { city } = useParams();
    const dispatch = useDispatch();
    const coaches = useSelector(state => Object.values(state.coaches.coaches))

    useEffect(() => {
        dispatch(fetchCoachesByCity(city.replace(/-/g, ' ')));
    }, [dispatch, city])

    return (
        <div>
            <h1>Coaches in {city.replace(/-/g, ' ')}</h1>
            <div className="coach-list">
                {coaches.length > 0 ? (
                    coaches.map((coach) => (
                        <div key={coach.id} className="coach-card">
                            <h3>{coach.first_name} {coach.last_name}</h3>
                            <p>Rate: ${coach.rate}</p>
                            <p>Availability: {coach.availability}</p> {/* Assuming you include availability */}
                            <Link to={`/coaches/${coach.id}`}>View Profile</Link>
                        </div>
                    ))
                ) : (
                    <p>No coaches available in {city.replace(/-/g, ' ')}.</p>
                )}
            </div>
        </div>
    );
};

export default CityCoaches;
