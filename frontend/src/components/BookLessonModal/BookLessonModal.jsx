import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAvailabilityThunk } from '../../redux/availability';
import { createBookingThunk, fetchBookingsThunk } from '../../redux/booking';
import { useModal } from '../../context/Modal';
import './BookLessonModal.css';

function BookLessonModal({ coach }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    // State for selected date, available times, selected time slots, loading and submitting indicators
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [loading, setLoading] = useState(false);  // For loading availability
    const [submitting, setSubmitting] = useState(false);  // For booking submission

    // Fetch availability from Redux store for the current coach (static weekly availability)
    const coachAvailability = useSelector(state => state.availability[coach.id] || []);

    // Fetch bookings for the selected date from Redux store
    const coachBookings = useSelector(state => state.bookings[coach.id]?.[selectedDate?.toISOString().split('T')[0]] || []);

    // Fetch availability when the modal is opened or when a date is selected
    useEffect(() => {
        if (selectedDate) {
            setLoading(true);  // Start loading indicator
            const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

            // Fetch the static weekly availability for the selected day
            dispatch(fetchAvailabilityThunk(coach.id, dayOfWeek)).then(() => setLoading(false));

            // Fetch bookings for the selected date
            dispatch(fetchBookingsThunk(coach.id, selectedDate));
        }
    }, [selectedDate, dispatch, coach.id]);

    // Update available times when availability or bookings change
    useEffect(() => {
        if (selectedDate) {
            const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

            // Filter static availability for the selected day of the week
            const filteredAvailability = coachAvailability.filter(
                availability => availability.day_of_week === dayOfWeek
            );

            if (filteredAvailability.length > 0) {
                const times = [];
                filteredAvailability.forEach(availability => {
                    let start = parseTime(availability.start_time);
                    let end = parseTime(availability.end_time);

                    while (start < end) {
                        const slotStart = formatTime(start);
                        const slotEnd = formatTime(addOneHour(start));

                        // Compare bookings with slots (format both to HH:mm)
                        const isBooked = coachBookings.some(booking => {
                            const bookingStart = parseTime(booking.start_time);
                            const bookingEnd = parseTime(booking.end_time);
                            // Check if the time slots overlap
                            return (start >= bookingStart && start < bookingEnd);
                        });

                        if (!isBooked) {
                            times.push(`${slotStart} - ${slotEnd}`);
                        }

                        start = addOneHour(start);
                    }
                });
                setAvailableTimes(times);
            } else {
                setAvailableTimes([]);  // No availability for the selected day
            }
        }
    }, [coachAvailability, selectedDate, coachBookings]);

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
            return;  // No alert needed, inline validation is now handled
        }

        setSubmitting(true);  // Start submission indicator
        // Prepare data for multiple time slots
        const bookingData = {
            coach_id: coach.id,
            booking_date: selectedDate.toISOString().split('T')[0],
            slots: selectedSlots.map(slot => {
                const [start_time, end_time] = slot.split(' - ');
                return { start_time, end_time };
            })
        };

        const result = await dispatch(createBookingThunk(bookingData));

        if (!result.errors) {
            alert('Booking successfully created!');
            closeModal();  // Close the modal after successful booking
        } else {
            alert('Failed to create booking. Please try again.');
        }
        setSubmitting(false);  // End submission indicator
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
                    {loading ? (
                        <p>Loading available times...</p>
                    ) : (
                        <>
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
                            {availableTimes.length > 0 && selectedSlots.length === 0 && (
                                <p className="error-message">Please select at least one time slot.</p>
                            )}
                        </>
                    )}
                </div>
            </div>
            <div className="modal-actions">
                <button
                    className="book-button"
                    onClick={handleBookLesson}
                    disabled={submitting || selectedSlots.length === 0}
                >
                    {submitting ? 'Booking...' : 'Book Lesson'}
                </button>
                <button className="cancel-button" onClick={closeModal} disabled={submitting}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default BookLessonModal;
