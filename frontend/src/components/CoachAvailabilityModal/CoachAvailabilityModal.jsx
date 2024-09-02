import React from 'react';
import { useSelector } from 'react-redux';
import './CoachAvailabilityModal.css';

function CoachAvailabilityModal({ coach, onClose }) {
    const availability = useSelector(state => state.availability[coach.id]);

    return (
        <div className="coach-availability-modal">
            <h1>{`Availability for Coach ${coach.first_name} ${coach.last_name}`}</h1>
            {availability && availability.length > 0 ? (
                <ul>
                    {availability.map((slot, index) => (
                        <li key={index}>
                            {slot.day_of_week}: {slot.start_time} - {slot.end_time}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No availability information found.</p>
            )}
            <button onClick={onClose}>Close</button>
        </div>
    );
}

export default CoachAvailabilityModal;
