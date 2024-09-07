import { useSelector } from 'react-redux';
import './CoachAvailabilityModal.css';

function CoachAvailabilityModal({ coach, onClose }) {
    const availability = useSelector(state => state.availability[coach.id]);

    return (
        <div className="coach-availability-modal">
            <h1>{`Availability for Coach ${coach.first_name}`}</h1>
            <h2>Day of the week / Time (24-hr)</h2>
            {availability && availability.length > 0 ? (
                <ul>
                    {availability.map((slot, index) => (
                        <li key={index} className="availability-slot">
                            <span className="day">{slot.day_of_week}</span>
                            <span className="time">{slot.start_time} - {slot.end_time}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>This coach has no availability at the moment!</p>
            )}
            <button onClick={onClose}>Close</button>
        </div>
    );
}

export default CoachAvailabilityModal;
