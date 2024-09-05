import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAvailabilityThunk } from '../../redux/availability';
import { createBookingThunk } from '../../redux/booking';
import { useModal } from '../../context/Modal';
import './BookLessonModal.css'

function BookLessonModal({ coach }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    // State for selected date, available times, and selected time slots
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]); // Changed to array

    // Fetch availability from Redux store for the current coach
    const coachAvailability = useSelector(state => state.availability[coach.id] || []);

    // Fetch the availability when the modal is opened or when a date is selected
    useEffect(() => {

        if (selectedDate) {
            const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

            // Dispatch fetchAvailabilityThunk to get availability for that coach and day of the week
            dispatch(fetchAvailabilityThunk(coach.id, dayOfWeek));
        }
    }, [selectedDate, dispatch, coach.id]);

    // Update available times when the coach availability in the store changes
    useEffect(() => {
        if (selectedDate) {
            const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

            // Filter availability for the selected day of the week
            const filteredAvailability = coachAvailability.filter(
                availability => availability.day_of_week === dayOfWeek
            );

            if (filteredAvailability.length > 0) {
                const times = [];
                // Break availability into one-hour increments
                filteredAvailability.forEach(availability => {
                    let start = parseTime(availability.start_time);
                    let end = parseTime(availability.end_time);

                    while (start < end) {
                        const slotStart = formatTime(start);
                        const slotEnd = formatTime(addOneHour(start));
                        times.push(`${slotStart} - ${slotEnd}`);
                        start = addOneHour(start);
                    }
                });
                setAvailableTimes(times);
            } else {
                setAvailableTimes([]);  // No availability for the selected day
            }
        }
    }, [coachAvailability, selectedDate]);

    // Parse time string (HH:MM) to a Date object
    const parseTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':');
        return new Date(0, 0, 0, parseInt(hours), parseInt(minutes));
    };

    // Format Date object to a time string (HH:MM)
    const formatTime = (date) => {
        return date.toTimeString().slice(0, 5);
    };

    // Add one hour to the Date object
    const addOneHour = (date) => {
        const newDate = new Date(date);
        newDate.setHours(date.getHours() + 1);
        return newDate;
    };

    // Handle selecting/deselecting time slots
    const toggleTimeSlot = (timeSlot) => {
        if (selectedSlots.includes(timeSlot)) {
            setSelectedSlots(selectedSlots.filter(slot => slot !== timeSlot));  // Deselect slot
        } else {
            setSelectedSlots([...selectedSlots, timeSlot]);  // Select slot
        }
    };

    // Handle booking submission
    const handleBookLesson = async () => {
        if (!selectedDate || selectedSlots.length === 0) {
            alert('Please select a date and at least one time slot.');
            return;
        }

        const bookingData = selectedSlots.map(slot => {
            const [start_time, end_time] = slot.split(' - ');  // Split selected time slot
            return {
                coach_id: coach.id,
                booking_date: selectedDate.toISOString().split('T')[0], // Format date to 'YYYY-MM-DD'
                start_time,  // Time in 'HH:MM' format
                end_time,    // Time in 'HH:MM' format
            };
        });

        const result = await dispatch(createBookingThunk(bookingData));

        if (!result.errors) {
            alert('Booking successfully created!');
            closeModal();  // Close the modal after successful booking
        } else {
            alert('Failed to create booking. Please try again.');
        }
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
                                    className={`timeslot-button ${selectedSlots.includes(time) ? 'selected' : ''}`}
                                    onClick={() => toggleTimeSlot(time)}
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
