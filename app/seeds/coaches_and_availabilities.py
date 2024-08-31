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
        {
            "first_name": "Rouzbeh",
            "last_name": "Kamran",
            "rate": 150,
            "bio": "My name Coach Rouzbeh and I am a professional tennis player from Iran.",
            "location": "Irvine",
            "image_url": "/images/coach_profile_image/Coach-Rouzbeh-Kamran.jpeg",
            "experience_years": 30,
            "availabilities": [
                {"day_of_week": "Monday", "start_time": "16:00", "end_time": "20:00"},
                {"day_of_week": "Tuesday", "start_time": "16:00", "end_time": "20:00"},
                {"day_of_week": "Wednesday", "start_time": "16:00", "end_time": "20:00"},
                {"day_of_week": "Thursday", "start_time": "16:00", "end_time": "20:00"},
                {"day_of_week": "Friday", "start_time": "20:00", "end_time": "22:00"},
                {"day_of_week": "Saturday", "start_time": "20:00", "end_time": "22:00"},
            ]
        },
    ]

    try:
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
            db.session.flush()  # Get the ID of the coach before committing

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
    
    except Exception as e:
        db.session.rollback()  # Rollback in case of any errors
        print(f"Error occurred: {e}")
    
    finally:
        db.session.close()

def undo_coaches_and_availabilities():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.availabilities RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.coaches RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM availabilities"))
        db.session.execute(text("DELETE FROM coaches"))
        
    db.session.commit()
