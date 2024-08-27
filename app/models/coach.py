from .db import db, environment, SCHEMA

class Coach(db.Model):
    __tablename__ = 'coaches'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(200), nullable=False)
    last_name = db.Column(db.String(200), nullable=False)
    rate = db.Column(db.Numeric(10, 2), nullable=False)
    bio = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    image_url = db.Column(db.String(200))
    experience_years = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

    # Relationships
    bookings = db.relationship('Booking', back_populates='coach', cascade="all, delete-orphan")
    availability = db.relationship('Availability', back_populates='coach', cascade="all, delete-orphan")
    reviews = db.relationship('Review', back_populates='coach', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'rate': str(self.rate), #ensure conversion of string for JSON serialization
            'bio': self.bio,
            'location': self.location,
            'image_url': self.image_url,
            'experience_years': self.experience_years,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
