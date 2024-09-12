from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import Review, Coach, db
from datetime import datetime, timezone

review_routes = Blueprint('reviews', __name__)

# CREATE REVIEW (POST /api/reviews)
@review_routes.route('', methods=['POST'])
@login_required
def create_review():
    """
    Create a review for a coach.
    """
    data = request.get_json()
    coach_id = data.get('coach_id')

    # Validate coach existence
    coach = Coach.query.get(coach_id)
    if not coach:
        return {'errors': 'Coach not found'}, 404
    
    # Validation to prevent reviewing same coach twice
    existing_review = Review.query.filter_by(user_id=current_user.id, coach_id=coach_id).first()
    if existing_review:
        return {'errors': "You have already reviewed this coach"}, 400

    # Validate rating
    rating = data.get('rating')
    if not (1 <= rating <= 5):
        return {'errors': 'Rating must be between 1 and 5'}, 400

    # Validate comment length
    comment = data.get('comment')
    if len(comment) > 200:
        return {'errors': 'Comment exceeds maximum length of 200 characters'}, 400

    current_time = datetime.now(timezone.utc)
    
    review = Review(
        user_id=current_user.id,
        coach_id=coach_id,
        rating=rating,
        comment=comment,
        created_at=current_time,
        updated_at=current_time
    )
    db.session.add(review)
    db.session.commit()
    return review.to_dict(), 201
    

# GET ALL REVIEWS FOR A COACH (GET /api/reviews/coach/<int:coach_id>)
@review_routes.route('/coach/<int:coach_id>')
@login_required
def get_reviews_by_coach(coach_id):
    """
    Get all reviews for a coach by coach id
    """
    coach = Coach.query.get(coach_id)
    if not coach:
        return {'errors': 'Coach not found'}, 404
    
    reviews = Review.query.filter_by(coach_id=coach.id).all()
    return {'reviews': [review.to_dict() for review in reviews]}, 200

# GET ALL REVIEWS MADE BY USER (GET /api/reviews/user)
@review_routes.route('/user')
@login_required
def get_reviews_by_user():
    """
    Get all reviews made by current user
    """
    reviews = Review.query.filter_by(user_id=current_user.id).all()
    return {'reviews': [review.to_dict() for review in reviews]}, 200

# UPDATE A REVIEW (PUT /api/reviews/<int:review_id>)
@review_routes.route('/<int:review_id>', methods=['PUT'])
@login_required
def update_review(review_id):
    """
    Update a review by the current user via review id
    """
    review = Review.query.get(review_id)
    if not review:
        return {'errors': 'Review not found'}, 404

    if review.user_id != current_user.id:
        return {'errors': 'Unauthorized to edit this review'}, 403

    data = request.get_json()

    # Validate rating
    rating = data.get('rating', review.rating)
    if not (1 <= rating <= 5):
        return {'errors': 'Rating must be between 1 and 5'}, 400

    # Validate comment length
    comment = data.get('comment', review.comment)
    if len(comment) > 200:
        return {'errors': 'Comment exceeds maximum length of 200 characters'}, 400

    review.rating = rating
    review.comment = comment
    review.updated_at = datetime.now(timezone.utc)

    db.session.commit()
    return review.to_dict(), 200

# DELETE A REVIEW (DELETE /api/reviews/<int:review_id>)
@review_routes.route('/<int:review_id>', methods=['DELETE'])
@login_required
def delete_review(review_id):
    """
    Delete a review by the current user via review id
    """
    review = Review.query.get(review_id)
    if not review:
        return {'errors': 'Review not found'}, 404
    
    if review.user_id != current_user.id:
        return {'errors': 'Unauthorized to delete this review'}, 403
    
    db.session.delete(review)
    db.session.commit()
    return {'message': 'Successfully deleted the review'}, 200
