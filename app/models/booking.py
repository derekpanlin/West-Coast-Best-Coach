from .db import db, environment, SCHEMA, add_prefix_for_prod

class Booking(db.Model):
    __tablename__ = 'bookings'
    
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
        
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    coach_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('coaches.id')), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    booking_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.String(5), nullable=False)
    end_time = db.Column(db.String(5), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

    # Relationships
    user = db.relationship('User', back_populates='bookings')
    coach = db.relationship('Coach', back_populates='bookings')
    

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'coach_id': self.coach_id,
            'location': self.location,
            'booking_date': self.booking_date.strftime('%Y-%m-%d'),  # Format the date as YYYY-MM-DD
            'day_of_week': self.booking_date.strftime('%A'),  # Include the day of the week
            'start_time': self.start_time,
            'end_time': self.end_time,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'user': self.user.to_dict(),  # Include user details
            'coach': self.coach.to_dict()  # Include coach details
        }
