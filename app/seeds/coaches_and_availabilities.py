from app.models import db, Coach, Availability, environment, SCHEMA
from sqlalchemy.sql import text

def seed_coaches_and_availabilities():
    coaches = [
        {
            "first_name": "Derek",
            "last_name": "Lin",
            "rate": 100,
            "bio": "My name is Coach Derek and I love to coach",
            "location": "Irvine",
            "image_url": "/images/coach_profile_image/Coach-Derek-Lin.jpeg",
            "experience_years": 16,
            "availabilities": [
                {"day_of_week": "Monday", "start_time": "08:00", "end_time": "10:00"},
                {"day_of_week": "Tuesday", "start_time": "08:00", "end_time": "10:00"}
            ]
        },
        # Rest of coaches add here
    ]

    for coach_data in coaches:
        # Create the coach
        coach = Coach(
            first_name=coach_data["first_name"],
            last_name=coach_data["last_name"],
            rate=coach_data["rate"],
            bio=coach_data["bio"],
            location=coach_data["location"],
            image_url=coach_data["image_url"],
            experience_years=coach_data["experience_years"]
        )
        db.session.add(coach)
        db.session.commit() 

        # Add availabilities for the coach
        for availability_data in coach_data["availabilities"]:
            availability = Availability(
                coach_id=coach.id,
                day_of_week=availability_data["day_of_week"],
                start_time=availability_data["start_time"],
                end_time=availability_data["end_time"]
            )
            db.session.add(availability)

    db.session.commit()

# Function to undo the coach and availability seeders
def undo_coaches_and_availabilities():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.availabilities RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.coaches RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM availabilities"))
        db.session.execute(text("DELETE FROM coaches"))
        
    db.session.commit()
