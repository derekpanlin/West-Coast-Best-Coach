from flask import Blueprint, request
from app.models import Coach, db

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
