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
# CREATE A BOOKING (POST /api/bookings)
@booking_routes.route('', methods=['POST'])
@login_required
def create_booking():
    """
    Create multiple bookings (one for each selected time slot) when logged in, but validate all slots first.
    """
    data = request.get_json()

    # Query for the coach
    coach = Coach.query.get(data['coach_id'])
    if not coach:
        return {'errors': 'Coach not found'}, 404

    booking_date = datetime.strptime(data['booking_date'], '%Y-%m-%d').date()
    day_of_week = booking_date.strftime('%A')

    # Check coach availability for that day
    availability = Availability.query.filter_by(coach_id=coach.id, day_of_week=day_of_week).first()
    if not availability:
        return {'errors': f'The coach is not available on {day_of_week}s'}, 400

    # Validate all time slots before creating any booking
    for slot in data['slots']:
        start_time = slot['start_time']
        end_time = slot['end_time']

        # Validate that the booking fits within the coach's available time slots
        if not (availability.start_time <= start_time < availability.end_time and
                availability.start_time < end_time <= availability.end_time):
            return {'errors': f'Time slot {start_time} - {end_time} is outside of the coach\'s available hours'}, 400

        # Validate no overlap with existing bookings
        existing_booking = Booking.query.filter_by(coach_id=coach.id, booking_date=booking_date).filter(
            db.or_(
                db.and_(Booking.start_time <= start_time, Booking.end_time > start_time),
                db.and_(Booking.start_time < end_time, Booking.end_time >= end_time)
            )
        ).first()

        if existing_booking:
            return {'errors': f'Time slot {start_time} - {end_time} is already booked'}, 400

    # If all slots are valid, proceed with creating bookings
    bookings = []
    for slot in data['slots']:
        start_time = slot['start_time']
        end_time = slot['end_time']

        new_booking = Booking(
            user_id=current_user.id,
            coach_id=coach.id,
            location=coach.location,
            booking_date=booking_date,
            start_time=start_time,
            end_time=end_time,
        )
        db.session.add(new_booking)
        bookings.append(new_booking)

    db.session.commit()
    return {'bookings': [booking.to_dict() for booking in bookings]}, 201
    
# GET ALL BOOKINGS (GET /api/bookings)
@booking_routes.route('/')
@login_required
def get_all_bookings():
    """
    Get all bookings for the current logged-in user
    """
    bookings = Booking.query.filter_by(user_id=current_user.id).all()
    return {'bookings': [booking.to_dict() for booking in bookings]}, 200

# GET A SPECIFIC BOOKING (GET /api/bookings/<int:id>)
@booking_routes.route('/<int:id>')
@login_required
def get_booking(id):
    """
    Get a specific booking by its ID
    """
    booking = Booking.query.get(id)
    if not booking or booking.user_id != current_user.id:
        return {'errors': 'Booking not found or you do not have permission to view this booking'}, 404
    
    return booking.to_dict(), 200

# UPDATE MULTIPLE BOOKINGS (PUT /api/bookings)
@booking_routes.route('', methods=['PUT'])
@login_required
def update_bookings():
    """
    Update multiple bookings when logged in, with validation for all slots.
    """
    data = request.get_json()
    bookings_to_update = data.get('bookings', [])

    updated_bookings = []

    for booking_data in bookings_to_update:
        booking_id = booking_data.get('id')
        booking = Booking.query.get(booking_id)

        if not booking or booking.user_id != current_user.id:
            return {'errors': f'Booking with ID {booking_id} not found or you do not have permission to update it'}, 404

        # Validate and update each booking similarly as in create_booking
        start_time = booking_data['start_time']
        end_time = booking_data['end_time']
        booking_date = datetime.strptime(booking_data['booking_date'], '%Y-%m-%d').date()
        day_of_week = booking_date.strftime('%A')

        # Check availability and conflicts (similar to the POST route)
        availability = Availability.query.filter_by(coach_id=booking.coach_id, day_of_week=day_of_week).first()

        if not availability:
            return {'errors': f'The coach is not available on {day_of_week}s'}, 400

        if not (availability.start_time <= start_time < availability.end_time and
                availability.start_time < end_time <= availability.end_time):
            return {'errors': f'Time slot {start_time} - {end_time} is outside of the coach\'s available hours'}, 400

        booking.booking_date = booking_date
        booking.start_time = start_time
        booking.end_time = end_time
        db.session.commit()

        updated_bookings.append(booking.to_dict())

    return {'bookings': updated_bookings}, 200

# DELETE A BOOKING (DELETE /api/bookings/<int:id>)
@booking_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_booking(id):
    """
    Delete a booking by its ID
    """
    
    booking = Booking.query.get(id)
    if not booking or booking.user_id != current_user.id:
        return {'errors': 'Booking not found or you do not have permission to delete this booking'}, 404
        
    db.session.delete(booking)
    db.session.commit()
    
    return {'message': 'Booking has been successfully deleted'}, 200
