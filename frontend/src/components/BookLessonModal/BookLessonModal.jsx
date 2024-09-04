import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAvailabilityThunk } from '../../redux/availability';
import { createBookingThunk } from '../../redux/booking';
import { useModal } from '../../context/Modal';
import './BookLessonModal.css'

function BookLessonModal() {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    // State for selected date, available times, and selected time slot
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);

    // Fetch availability based on the selected date
    useEffect(() => {
        if (selectedDate) {
            const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

            // Fetch availability for the coach for that day of the week
            const fetchAvailability = async () => {
                const availability = await dispatch(fetchAvailabilityThunk(coach.id, dayOfWeek));

                if (availability && availability.length > 0) {
                    setAvailableTimes(availability); // Set available times for that day
                } else {
                    setAvailableTimes([]); // No availability for the selected day
                }
            };

            fetchAvailability();
        }
    }, [selectedDate, dispatch, coach.id]);

    // Handle booking submission
    const handleBookLesson = async () => {
        if (!selectedDate || !selectedTime) {
            alert('Please select a date and time.');
            return;
        }

        const bookingData = {
            coach_id: coach.id,
            booking_date: selectedDate.toISOString().split('T')[0], // Format date to 'YYYY-MM-DD'
            start_time: selectedTime, // Time in 'HH:MM' format
            end_time: calculateEndTime(selectedTime), // One hour from start time
        };

        const result = await dispatch(createBookingThunk(bookingData));

        if (!result.errors) {
            alert('Booking successfully created!');
            closeModal();  // Close the modal after successful booking
        } else {
            alert('Failed to create booking. Please try again.');
        }
    };

    // Function to calculate end time (1-hour increments)
    const calculateEndTime = (startTime) => {
        const [hours, minutes] = startTime.split(':');
        const endTime = new Date(0, 0, 0, parseInt(hours) + 1, parseInt(minutes));
        return endTime.toTimeString().slice(0, 5); // Return time in 'HH:MM' format
    };



    return (
        <div className="book-lesson-modal">
            <h2>Book a Lesson with {coach.first_name} {coach.last_name}</h2>
            <div className="modal-content">
                <div className="calendar-section">
                    <h3>Choose a Date</h3>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select a date"
                        minDate={new Date()} // Disable past dates
                    />
                </div>
                <div className="timeslots-section">
                    <h3>Available Times</h3>
                    {selectedDate && availableTimes.length > 0 ? (
                        <div className="timeslots">
                            {availableTimes.map((time) => (
                                <button
                                    key={time}
                                    className={`timeslot-button ${selectedTime === time ? 'selected' : ''}`}
                                    onClick={() => setSelectedTime(time)}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p>No available times for the selected date.</p>
                    )}
                </div>
            </div>
            <div className="modal-actions">
                <button className="book-button" onClick={handleBookLesson}>
                    Book Lesson
                </button>
                <button className="cancel-button" onClick={closeModal}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default BookLessonModal;
