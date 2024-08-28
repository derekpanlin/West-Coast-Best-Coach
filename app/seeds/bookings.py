from app.models import db, User, Coach, Booking, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_all_bookings():
    # Fetch users and coaches to seed
    demo_user = User.query.filter_by(username='Demo').first()
    coach_derek = Coach.query.filter_by(first_name='Derek', last_name='Lin').first()
    
    if demo_user and coach_derek:
        booking_demo = Booking(
            user_id=demo_user.id,
            coach_id=coach_derek.id,
            location=coach_derek.location,
            booking_date=datetime.strptime('2024-12-01', '%Y-%m-%d').date(),
            start_time='08:00',
            end_time='09:00'
        )
        db.session.add(booking_demo)
    
    db.session.commit()
    
def undo_all_bookings():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.bookings RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM bookings"))
        
    db.session.commit()
