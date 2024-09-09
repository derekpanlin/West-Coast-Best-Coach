import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAvailabilityThunk } from '../../redux/availability';
import { updateBookingThunk, fetchBookingsThunk, getBookingsThunk } from '../../redux/booking';
import { useModal } from '../../context/Modal';
import { useNavigate } from 'react-router-dom';
import './UpdateLessonModal.css';

function UpdateLessonModal({ coach, initialLesson }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { closeModal } = useModal();

    const [selectedDate, setSelectedDate] = useState(new Date(initialLesson.booking_date));
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(`${initialLesson.start_time} - ${initialLesson.end_time}`);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const coachAvailability = useSelector(state => state.availability[coach.id] || []);
    const formattedDate = selectedDate.toISOString().split('T')[0];  // Use normalized date string

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
            const isToday = selectedDate.toDateString() === new Date().toDateString(); // Check if selected date is today
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

                        // Only add future time slots if today
                        if (!isBooked && (!isToday || start > currentTime)) {
                            times.push(`${slotStart} - ${slotEnd}`);
                        }

                        start = addOneHour(start);
                    }
                });
                setAvailableTimes(times);

                if (formattedDate !== initialLesson.booking_date) {
                    setSelectedSlot('');
                }
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

    const handleUpdateLesson = async () => {
        if (!selectedDate || !selectedSlot) {
            return;
        }

        setSubmitting(true);

        // Construct updated booking data
        const [start_time, end_time] = selectedSlot.split(' - ');
        const updatedData = {
            start_time,
            end_time,
            booking_date: selectedDate.toISOString().split('T')[0],
        };

        // Update the current booking
        const result = await dispatch(updateBookingThunk(initialLesson.id, updatedData));

        if (!result.errors) {
            await dispatch(getBookingsThunk());

            closeModal();
            navigate('/manage-lessons');
        } else {
            alert('Failed to update booking. Please try again.');
        }

        setSubmitting(false);
    };

    return (
        <div className="update-lesson-modal">
            <h2>Update Lesson with Coach {coach.first_name}</h2>
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
                                            className={`timeslot-button ${selectedSlot === time ? 'selected' : ''}`}
                                            onClick={() => setSelectedSlot(time)}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p>No available times for the selected date.</p>
                            )}
                        </>
                    )}
                </div>
            </div>
            <div className="modal-actions">
                <button
                    className="book-button"
                    onClick={handleUpdateLesson}
                    disabled={submitting || !selectedSlot}
                >
                    {submitting ? 'Processing...' : 'Update Lesson'}
                </button>
                <button className="cancel-button" onClick={closeModal} disabled={submitting}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default UpdateLessonModal;
