import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBookingsThunk, deleteBookingThunk } from '../../redux/booking';
import { useModal } from '../../context/Modal';
import UpdateLessonModal from '../UpdateLessonModal/UpdateLessonModal';
import './ManageLessonsPage.css';

function ManageLessonsPage() {
    const dispatch = useDispatch();
    const bookings = useSelector(state => state.bookings.bookings || {});
    const { setModalContent, closeModal } = useModal();

    const currentDateTime = new Date(); // Get the full current date and time

    // Filter upcoming lessons and sort by date (soonest first), then by start time
    const upcomingLessons = Object.values(bookings)
        .filter(lesson => {
            const lessonDateTime = new Date(`${lesson.booking_date}T${lesson.start_time}`);
            return lessonDateTime >= currentDateTime; // Compare both date and time
        })
        .sort((a, b) => {
            const dateComparison = new Date(`${a.booking_date}T${a.start_time}`) - new Date(`${b.booking_date}T${b.start_time}`);
            return dateComparison;
        });

    // Filter past lessons and sort by date (latest first), then by start time
    const pastLessons = Object.values(bookings)
        .filter(lesson => {
            const lessonDateTime = new Date(`${lesson.booking_date}T${lesson.start_time}`);
            return lessonDateTime < currentDateTime; // Compare both date and time
        })
        .sort((a, b) => {
            const dateComparison = new Date(`${b.booking_date}T${b.start_time}`) - new Date(`${a.booking_date}T${a.start_time}`);
            return dateComparison;
        });


    useEffect(() => {
        dispatch(getBookingsThunk());
    }, [dispatch]);

    // const handleUpdate = (lesson) => {
    //     const correctDate = new Date(lesson.booking_date + 'T00:00:00');  // Ensure no timezone conversion
    //     setModalContent(
    //         <BookLessonModal
    //             coach={lesson.coach}
    //             initialLesson={{ ...lesson, booking_date: correctDate }}
    //             isUpdate={true}
    //             onClose={closeModal}
    //         />
    //     );
    // };

    const handleUpdate = (lesson) => {
        const correctDate = new Date(lesson.booking_date + 'T00:00:00');  // Ensure no timezone conversion
        setModalContent(
            <UpdateLessonModal
                coach={lesson.coach}
                initialLesson={{ ...lesson, booking_date: correctDate }}
                onClose={closeModal}
            />
        );
    };

    const handleDelete = async (lessonId) => {
        const confirmed = window.confirm('Are you sure you want to delete this lesson?')
        if (confirmed) {
            await dispatch(deleteBookingThunk(lessonId))
            dispatch(getBookingsThunk())
        }
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
