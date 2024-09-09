// CODE FOR WHEN BookLessonModal was combined with Updating

// import { useState, useEffect } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchAvailabilityThunk } from '../../redux/availability';
// import { createBookingThunk, updateBookingThunk, fetchBookingsThunk } from '../../redux/booking';
// import { useModal } from '../../context/Modal';
// import { useNavigate } from 'react-router-dom';
// import './BookLessonModal.css';

// function BookLessonModal({ coach, initialLesson, isUpdate = false }) {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { closeModal } = useModal();

//     // Ensure correct date handling by treating the date as a string in "YYYY-MM-DD" format
//     const [selectedDate, setSelectedDate] = useState(initialLesson ? new Date(initialLesson.booking_date) : null);
//     const [availableTimes, setAvailableTimes] = useState([]);
//     const [selectedSlots, setSelectedSlots] = useState(
//         initialLesson ? [`${initialLesson.start_time} - ${initialLesson.end_time}`] : []
//     );
//     const [loading, setLoading] = useState(false);
//     const [submitting, setSubmitting] = useState(false);

//     const coachAvailability = useSelector(state => state.availability[coach.id] || []);
//     const formattedDate = selectedDate?.toISOString().split('T')[0];

//     const coachBookings = useSelector(state => {
//         const bookingsByCoach = state.bookings.bookingsByDate[coach.id];
//         return bookingsByCoach ? bookingsByCoach[formattedDate]?.bookings || [] : [];
//     });

//     useEffect(() => {
//         if (selectedDate) {
//             setLoading(true);
//             const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

//             const fetchData = async () => {
//                 await dispatch(fetchAvailabilityThunk(coach.id, dayOfWeek));
//                 await dispatch(fetchBookingsThunk(coach.id, selectedDate));
//                 setLoading(false);
//             };

//             fetchData();
//         }
//     }, [selectedDate, dispatch, coach.id]);

//     useEffect(() => {
//         if (selectedDate && coachAvailability.length > 0) {
//             const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

//             const filteredAvailability = coachAvailability.filter(
//                 availability => availability.day_of_week === dayOfWeek
//             );

//             if (filteredAvailability.length > 0) {
//                 const times = [];
//                 filteredAvailability.forEach(availability => {
//                     let start = parseTime(availability.start_time);
//                     let end = parseTime(availability.end_time);

//                     while (start < end) {
//                         const slotStart = formatTime(start);
//                         const slotEnd = formatTime(addOneHour(start));

//                         const isBooked = coachBookings.some(
//                             booking =>
//                                 formatTime(parseTime(booking.start_time)) === slotStart &&
//                                 formatTime(parseTime(booking.end_time)) === slotEnd
//                         );

//                         if (!isBooked) {
//                             times.push(`${slotStart} - ${slotEnd}`);
//                         }

//                         start = addOneHour(start);
//                     }
//                 });
//                 setAvailableTimes(times);
//             } else {
//                 setAvailableTimes([]);
//             }
//         }
//     }, [coachAvailability, selectedDate, coachBookings]);

//     useEffect(() => {
//         // Clear selectedSlots when the date changes, unless we're updating an existing lesson
//         if (!isUpdate || !initialLesson || new Date(initialLesson.booking_date).toISOString().split('T')[0] !== formattedDate) {
//             setSelectedSlots([]);
//         }
//     }, [selectedDate, isUpdate, initialLesson, formattedDate]);

//     const parseTime = (timeStr) => {
//         const [hours, minutes] = timeStr.split(':');
//         return new Date(0, 0, 0, parseInt(hours), parseInt(minutes));
//     };

//     const formatTime = (date) => {
//         return date.toTimeString().slice(0, 5);
//     };

//     const addOneHour = (date) => {
//         const newDate = new Date(date);
//         newDate.setHours(date.getHours() + 1);
//         return newDate;
//     };

//     const toggleTimeSlot = (timeSlot) => {
//         if (selectedSlots.includes(timeSlot)) {
//             setSelectedSlots(selectedSlots.filter(slot => slot !== timeSlot));
//         } else {
//             setSelectedSlots([...selectedSlots, timeSlot]);
//         }
//     };

//     const handleBookOrUpdateLesson = async () => {
//         if (!selectedDate || selectedSlots.length === 0) {
//             return;
//         }

//         setSubmitting(true);

//         // Construct booking data
//         const bookingData = {
//             coach_id: coach.id,
//             booking_date: selectedDate.toISOString().split('T')[0],
//             slots: selectedSlots.map(slot => {
//                 const [start_time, end_time] = slot.split(' - ');
//                 return {
//                     id: initialLesson?.id || null,  // Ensure the current lesson ID is being passed for updates
//                     start_time,
//                     end_time,
//                     booking_date: selectedDate.toISOString().split('T')[0],
//                 };
//             })
//         };

//         // For updating a lesson, ensure only one time slot can be selected
//         if (isUpdate && initialLesson) {
//             // Check that only one time slot has been selected
//             if (selectedSlots.length !== 1) {
//                 alert('You can only update to one time slot.');
//                 setSubmitting(false);
//                 return;
//             }

//             // Update the current booking
//             const updatedData = bookingData.slots[0];  // Send only the selected slot for update
//             const result = await dispatch(updateBookingThunk(initialLesson.id, updatedData));  // Update the existing booking

//             if (!result.errors) {
//                 closeModal();
//                 navigate('/manage-lessons');
//             } else {
//                 alert('Failed to update booking. Please try again.');
//             }
//         } else {
//             // Handle new booking creation if not an update
//             const result = await dispatch(createBookingThunk(bookingData));
//             if (!result.errors) {
//                 closeModal();
//                 navigate('/manage-lessons');
//             } else {
//                 alert('Failed to create booking. Please try again.');
//             }
//         }

//         setSubmitting(false);
//     };

//     return (
//         <div className="book-lesson-modal">
//             <h2>{isUpdate ? `Update Lesson with Coach ${coach.first_name}` : `Book a Lesson with Coach ${coach.first_name}`}</h2>
//             <div className="modal-content">
//                 <div className="calendar-section">
//                     <h3>Choose a Date</h3>
//                     <DatePicker
//                         selected={selectedDate}
//                         onChange={(date) => setSelectedDate(new Date(date.toISOString().split('T')[0] + 'T00:00:00'))}
//                         dateFormat="yyyy-MM-dd"
//                         placeholderText="Select a date"
//                         minDate={new Date()}
//                     />
//                 </div>
//                 <div className="timeslots-section">
//                     <h3>Available Times</h3>
//                     {loading ? (
//                         <p>Loading available times...</p>
//                     ) : (
//                         <>
//                             {selectedDate && availableTimes.length > 0 ? (
//                                 <div className="timeslots">
//                                     {availableTimes.map((time) => (
//                                         <button
//                                             key={time}
//                                             className={`timeslot-button ${selectedSlots.includes(time) ? 'selected' : ''}`}
//                                             onClick={() => toggleTimeSlot(time)}
//                                         >
//                                             {time}
//                                         </button>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <p>No available times for the selected date.</p>
//                             )}
//                             {availableTimes.length > 0 && selectedSlots.length === 0 && (
//                                 <p className="error-message">Please select at least one time slot.</p>
//                             )}
//                         </>
//                     )}
//                 </div>
//             </div>
//             <div className="modal-actions">
//                 <button
//                     className="book-button"
//                     onClick={handleBookOrUpdateLesson}
//                     disabled={submitting || selectedSlots.length === 0}
//                 >
//                     {submitting ? 'Processing...' : isUpdate ? 'Update Lesson' : 'Book Lesson'}
//                 </button>
//                 <button className="cancel-button" onClick={closeModal} disabled={submitting}>
//                     Cancel
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default BookLessonModal;

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
    const formattedDate = selectedDate?.toISOString().split('T')[0];

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
            const isToday = new Date().toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0]; // Check if today is selected
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

                        // Only include time slots that are in the future for today
                        if (!isToday || start > currentTime) {
                            const isBooked = coachBookings.some(
                                booking =>
                                    formatTime(parseTime(booking.start_time)) === slotStart &&
                                    formatTime(parseTime(booking.end_time)) === slotEnd
                            );

                            if (!isBooked) {
                                times.push(`${slotStart} - ${slotEnd}`);
                            }
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
        const bookingData = {
            coach_id: coach.id,
            booking_date: selectedDate.toISOString().split('T')[0],
            slots: selectedSlots.map(slot => {
                const [start_time, end_time] = slot.split(' - ');
                return { start_time, end_time, booking_date: selectedDate.toISOString().split('T')[0] };
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
                    {submitting ? 'Processing...' : 'Book Lesson'}
                </button>
                <button className="cancel-button" onClick={closeModal} disabled={submitting}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default BookLessonModal;
