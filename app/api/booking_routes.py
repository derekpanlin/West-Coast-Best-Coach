from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import Booking, Coach, Availability, db
from datetime import datetime

# Prefixed with /api/bookings
booking_routes = Blueprint('bookings', __name__)


"""
	1.	Create a Booking (POST /api/bookings):
	•	Request: Sends JSON data with the coach_id, booking_date, start_time, and end_time.
	•	Validation: The route checks if the coach exists, and you should add logic to validate the booking time against the coach’s availability.
	•	Response: Returns the newly created booking.
    
	2.	Get All Bookings (GET /api/bookings):
	•	Request: Fetches all bookings for the currently logged-in user.
	•	Response: Returns a list of bookings, each in dictionary format.
    
	3.	Get a Specific Booking (GET /api/bookings/<int:id>):
	•	Request: Fetches a specific booking by its ID.
	•	Validation: Ensures the booking belongs to the currently logged-in user.
	•	Response: Returns the booking details.
    
	4.	Update a Booking (PUT /api/bookings/<int:id>):
	•	Request: Sends JSON data to update the booking’s booking_date, start_time, and end_time.
	•	Validation: Ensures the booking exists, belongs to the current user, and that the new time doesn’t conflict with the coach’s availability.
	•	Response: Returns the updated booking.
    
	5.	Delete a Booking (DELETE /api/bookings/<int:id>):
	•	Request: Deletes a specific booking by its ID.
	•	Validation: Ensures the booking belongs to the current user.
	•	Response: Confirms that the booking was deleted.
    
"""
# Create a booking (POST)
@booking_routes.route('/', methods=['POST'])
@login_required
def create_booking():
    """
    Create a new booking when logged in
    """
    # Parse into python dictionary
    data = request.get_json()
    
    # Query for the coach
    coach = Coach.query.get(data['coach_id'])
    if not coach:
        return {'errors': 'Coach not found'}, 404
    
    booking_date = datetime.strptime(data['booking_date'], '%Y-%m-%d').date()
    start_time = data['start_time']
    end_time = data['end_time']
    
    # Extract the day of the week from datetime object (Ex: Monday, Tuesday...
    day_of_week = booking_date.strftime('%A')
    
    # Check if coach is available for that day
    availability = Availability.query.filter_by(coach_id=coach.id, day_of_week=day_of_week).first()
    if not availability:
        return {'errors': f'The coach is not available on {day_of_week}s'}, 400
    
    # Validation if booking time fits within the coach's available time slots
    if not (availability.start_time <= start_time < availability.end_time and
            availability.start_time < end_time <= availability.end_time):
        return {'errors': 'The booking time is outside of the coach\'s available hours'}, 400
    
    # Validation to check if booking overlaps with existing booking
    existing_booking = Booking.query.filter_by(coach_id=coach.id, booking_date=booking_date).filter(
        db.or_(
            db.and_(Booking.start_time <= start_time, Booking.end_time > start_time),
            db.and_(Booking.start_time < end_time, Booking.end_time >= end_time)
        )
    ).first()
    
    if existing_booking:
        return {'errors': 'This time slot is already booked'}, 400
    
    new_booking = Booking(
        user_id=current_user.id,
        coach_id=coach.id,
        location=coach.location,
        booking_date=booking_date,
        start_time=start_time,
        end_time=end_time,
    )
    
    db.session.add(new_booking)
    db.session.commit()
    
    return new_booking.to_dict(), 201
    
