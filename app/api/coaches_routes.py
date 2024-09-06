from flask import Blueprint, request
from app.models import Coach, Booking, db
from datetime import datetime

# Prefixed with /api/coaches
coach_routes = Blueprint('coaches', __name__)

# GET ALL COACHES (GET /api/coaches)
@coach_routes.route('/', methods=['GET'])
def get_all_coaches():
    """
    Get a list of all coaches
    """
    coaches = Coach.query.all()
    return {'coaches': [coach.to_dict() for coach in coaches]}, 200

# GET A SPECIFIC COACH (GET /api/coaches/<int:id>)
@coach_routes.route('/<int:id>', methods=['GET'])
def get_coach(id):
    """
    Get details of a specific coach by ID
    """
    coach = Coach.query.get(id)
    if not coach:
        return {'errors': 'Coach not found'}, 404
    
    return coach.to_dict(), 200

# GET BOOKINGS FOR A COACH ON A SPECIFIC DATE (GET /api/coaches/<int:coach_id>/bookings)
@coach_routes.route('/<int:coach_id>/bookings', methods=['GET'])
def get_bookings_by_coach_and_date(coach_id):
    """
    Get all bookings for a specific coach on a specific date
    """
    date_str = request.args.get('date')
    if not date_str:
        return {'errors': 'Date not specified'}, 400
    
    try:
        booking_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return {'errors': 'Invalid date format'}, 400

    # Get all bookings for the specified coach and date
    bookings = Booking.query.filter_by(coach_id=coach_id, booking_date=booking_date).all()
    
    return {'bookings': [booking.to_dict() for booking in bookings]}, 200

# GET COACHES BY CITY (GET /api/coaches?city=<city_name>)
@coach_routes.route('/', methods=['GET'])
def get_coaches_by_city():
    """
    Get a list of coaches by city
    """
    city = request.args.get('city')
    if not city:
        return {'errors': 'City not specified'}, 400
    
    coaches = Coach.query.filter_by(location=city).all()
    return {'coaches': [coach.to_dict() for coach in coaches]}, 200

# GET COACH AVAILABILITY (GET /api/coaches/<int:id>/availability)
@coach_routes.route('/<int:id>/availability', methods=['GET'])
def get_coach_availability(id):
    """
    Get availability of a specific coach by ID
    """
    coach = Coach.query.get(id)
    if not coach:
        return {'errors': 'Coach not found'}, 404
    
    availability = [a.to_dict() for a in coach.availability]
    return {'availability': availability}, 200
