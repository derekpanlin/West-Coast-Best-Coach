from app.models import db, Coach, Review, environment, SCHEMA
from sqlalchemy.sql import text

def seed_reviews():
    reviews = [
        {
            "user_id": 1,
            "coach_id": 1,
            "rating": 5,
            "comment": "Coach Derek is truly one of the best coaches I've ever had! Worth every penny!" 
        },
        {
            "user_id": 1,
            "coach_id": 2,
            "rating": 5,
            "comment": "Excellent coach. Funny guy too.",
        },
        {
            "user_id": 2,
            "coach_id": 3,
            "rating": 4,
            "comment": "Federer is amazing but I wish I could afford his rate...",
        },
        {
            "user_id": 3,
            "coach_id": 1,
            "rating": 5,
            "comment": "Amazing lesson with Coach Derek! Lesson was completely free too which is an added bonus (we're married haha)!",
        },
        {
            "user_id": 1,
            "coach_id": 4,
            "rating": 3,
            "comment": "So expensive.",
        },
        {
            "user_id": 3,
            "coach_id": 5,
            "rating": 1,
            "comment": "He only spoke Japanese to me. I don't speak Japanese...",
        },
        {
            "user_id": 2,
            "coach_id": 6,
            "rating": 5,
            "comment": "Great coach and an even greater guy! Would book again.",
        },
    ]
    
    try:
        for review_data in reviews:
            review = Review(
                user_id=review_data["user_id"],
                coach_id=review_data["coach_id"],
                rating=review_data["rating"],
                comment=review_data["comment"]
            )
            db.session.add(review)
        
        db.session.commit()
    
    except Exception as e:
        db.session.rollback()
        print(f"Error occurred: {e}")
    
    finally:
        db.session.close()

def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))
        
    db.session.commit()
