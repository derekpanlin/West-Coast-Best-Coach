import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBookingsThunk } from '../../redux/booking';
import { useModal } from '../../context/Modal';
import BookLessonModal from '../BookLessonModal/BookLessonModal';
import './ManageLessonsPage.css';

function ManageLessonsPage() {
    const dispatch = useDispatch();
    const bookings = useSelector(state => state.bookings.bookings || {});
    const { setModalContent, closeModal } = useModal();

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
        dispatch(getBookingsThunk());
    }, [dispatch]);

    const handleUpdate = (lesson) => {
        setModalContent(
            <BookLessonModal
                coach={lesson.coach}
                initialLesson={lesson}
                isUpdate={true}
                onClose={closeModal}
            />
        )
    }

    return (
        <div className="manage-lessons-page">
            <h1>Manage Lessons</h1>

            <h2>Upcoming Lessons</h2>
            <div className="lesson-list">
                {upcomingLessons.length > 0 ? (
                    upcomingLessons.map(lesson => (
                        <div key={lesson.id} className="lesson-card">
                            <div className="lesson-info">
                                <img
                                    src={lesson.coach.image_url}
                                    alt={`Coach ${lesson.coach.first_name}`}
                                    className="lesson-coach-image"
                                />
                                <div className="lesson-details">
                                    <h3>Coach {lesson.coach.first_name} {lesson.coach.last_name}</h3>
                                    <p><strong>Date:</strong> {lesson.booking_date}</p>
                                    <p><strong>Time:</strong> {lesson.start_time} - {lesson.end_time}</p>
                                    <p><strong>Location:</strong> {lesson.location}</p>
                                </div>
                            </div>
                            <div className="lesson-actions">
                                <button className="update-btn" onClick={() => handleUpdate(lesson)}>Update</button>
                                <button className="delete-btn" onClick={() => handleDelete(lesson.id)}>Delete</button>
                            </div>
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
                            <div className="lesson-info">
                                <img
                                    src={lesson.coach.image_url}
                                    alt={`Coach ${lesson.coach.first_name}`}
                                    className="lesson-coach-image"
                                />
                                <div className="lesson-details">
                                    <h3>Coach {lesson.coach.first_name} {lesson.coach.last_name}</h3>
                                    <p><strong>Date:</strong> {lesson.booking_date}</p>
                                    <p><strong>Time:</strong> {lesson.start_time} - {lesson.end_time}</p>
                                    <p><strong>Location:</strong> {lesson.location}</p>
                                </div>
                            </div>
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
