from .db import db, environment, SCHEMA, add_prefix_for_prod

class Availability(db.Model):
    __tablename__ = 'availabilities'  

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    coach_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('coaches.id')), nullable=False)
    day_of_week = db.Column(db.String(50), nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)

    # Relationships
    coach = db.relationship('Coach', back_populates='availability')

    def to_dict(self):
        return {
            'id': self.id,
            'coach_id': self.coach_id,
            'day_of_week': self.day_of_week,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'coach': self.coach.to_dict()  # Include coach details
        }
