// Simplified code without update feature
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAvailabilityThunk } from '../../redux/availability';
import { createBookingThunk, fetchBookingsThunk } from '../../redux/booking';
import { useModal } from '../../context/Modal';
import { useNavigate } from 'react-router-dom';
import './BookLessonModal.css';

function BookLessonModal({ coach }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { closeModal } = useModal();

    const [selectedDate, setSelectedDate] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const coachAvailability = useSelector(state => state.availability[coach.id] || []);
    const formattedDate = selectedDate?.toLocaleDateString('en-CA');

    const coachBookings = useSelector(state => {
        const bookingsByCoach = state.bookings.bookingsByDate[coach.id];
        return bookingsByCoach ? bookingsByCoach[formattedDate]?.bookings || [] : [];
    });

    useEffect(() => {
        if (selectedDate) {
            setLoading(true);
            const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

            const fetchData = async () => {
                await dispatch(fetchAvailabilityThunk(coach.id, dayOfWeek));
                await dispatch(fetchBookingsThunk(coach.id, selectedDate));
                setLoading(false);
            };

            fetchData();
        }
    }, [selectedDate, dispatch, coach.id]);

    useEffect(() => {
        if (selectedDate && coachAvailability.length > 0) {
            const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
            // const isToday = new Date().toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0]; // Check if today is selected
            const isToday = new Date().toDateString() === selectedDate.toDateString();
            const currentTime = new Date(); // Current time

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

                        const isBooked = coachBookings.some(
                            booking =>
                                formatTime(parseTime(booking.start_time)) === slotStart &&
                                formatTime(parseTime(booking.end_time)) === slotEnd
                        );

                        // If today, only include future time slots
                        if (!isBooked && (!isToday || start > currentTime)) {
                            times.push(`${slotStart} - ${slotEnd}`);
                        }

                        start = addOneHour(start);
                    }
                });
                setAvailableTimes(times);
            } else {
                setAvailableTimes([]);
            }
        }
    }, [coachAvailability, selectedDate, coachBookings]);

    const parseTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':');
        return new Date(0, 0, 0, parseInt(hours), parseInt(minutes));
    };

    const formatTime = (date) => {
        return date.toTimeString().slice(0, 5);
    };

    const addOneHour = (date) => {
        const newDate = new Date(date);
        newDate.setHours(date.getHours() + 1);
        return newDate;
    };

    const toggleTimeSlot = (timeSlot) => {
        if (selectedSlots.includes(timeSlot)) {
            setSelectedSlots(selectedSlots.filter(slot => slot !== timeSlot));
        } else {
            setSelectedSlots([...selectedSlots, timeSlot]);
        }
    };

    const handleBookLesson = async () => {
        if (!selectedDate || selectedSlots.length === 0) {
            return;
        }

        setSubmitting(true);

        // Construct booking data
        // const bookingData = {
        //     coach_id: coach.id,
        //     booking_date: selectedDate.toISOString().split('T')[0],
        //     slots: selectedSlots.map(slot => {
        //         const [start_time, end_time] = slot.split(' - ');
        //         return { start_time, end_time, booking_date: selectedDate.toISOString().split('T')[0] };
        //     })
        // };

        const bookingData = {
            coach_id: coach.id,
            booking_date: selectedDate.toLocaleDateString('en-CA'), // Format for yyyy-mm-dd in local time
            slots: selectedSlots.map(slot => {
                const [start_time, end_time] = slot.split(' - ');
                return { start_time, end_time, booking_date: selectedDate.toLocaleDateString('en-CA') }; // Updated to local time
            })
        };

        // Handle new booking creation
        const result = await dispatch(createBookingThunk(bookingData));
        if (!result.errors) {
            closeModal();
            navigate('/manage-lessons');
        } else {
            alert('Failed to create booking. Please try again.');
        }

        setSubmitting(false);
    };

    return (
        <div className="book-lesson-modal">
            <h2>Book a Lesson with Coach {coach.first_name}</h2>
            <div className="modal-content">
                <div className="calendar-section">
                    <h3>Choose a Date</h3>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(new Date(date.toISOString().split('T')[0] + 'T00:00:00'))}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select a date"
                        minDate={new Date()}
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
                    {submitting ? 'Processing...' : selectedSlots.length > 1 ? 'Book Lessons' : 'Book Lesson'}
                </button>
                <button className="cancel-button" onClick={closeModal} disabled={submitting}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default BookLessonModal;
