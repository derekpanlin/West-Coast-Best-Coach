import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { getBookingsThunk } from '../../redux/booking';
import './ManageLessonsPage.css'

function ManageLessonsPage() {
    const dispatch = useDispatch();

    const bookings = useSelector(state => state.bookings.bookings || {})

    const currentDate = new Date();

    // Filter upcoming lessons and sort by date (soonest first)
    const upcomingLessons = Object.values(bookings)
        .filter(lesson => new Date(lesson.booking_date) >= currentDate)
        .sort((a, b) => new Date(a.booking_date) - new Date(b.booking_date));

    // Filter past lessons and sort by date (latest first)
    const pastLessons = Object.values(bookings)
        .filter(lesson => new Date(lesson.booking_date) < currentDate)
        .sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date));
    useEffect(() => {
        dispatch(getBookingsThunk())
    }, [dispatch])

    return (
        <div>
            <h1>Manage Lessons</h1>

            <h2>Upcoming Lessons</h2>
            <div className="lesson-list">
                {upcomingLessons.length > 0 ? (
                    upcomingLessons.map(lesson => (
                        <div key={lesson.id} className="lesson-card">
                            <p><strong>Coach:</strong> {lesson.coach.first_name} {lesson.coach.last_name}</p>
                            <p><strong>Date:</strong> {lesson.booking_date}</p>
                            <p><strong>Time:</strong> {lesson.start_time} - {lesson.end_time}</p>
                        </div>
                    ))
                ) : (
                    <p>No upcoming lessons.</p>
                )}
            </div>

            <h2>Past Lessons</h2>
            <div className="lesson-list">
                {pastLessons.length > 0 ? (
                    pastLessons.map(lesson => (
                        <div key={lesson.id} className="lesson-card">
                            <p><strong>Coach:</strong> {lesson.coach.first_name} {lesson.coach.last_name}</p>
                            <p><strong>Date:</strong> {lesson.booking_date}</p>
                            <p><strong>Time:</strong> {lesson.start_time} - {lesson.end_time}</p>
                        </div>
                    ))
                ) : (
                    <p>No past lessons.</p>
                )}
            </div>
        </div>
    );
}

export default ManageLessonsPage;
