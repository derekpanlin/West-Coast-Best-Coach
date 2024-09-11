from app.models import db, Coach, Availability, environment, SCHEMA
from sqlalchemy.sql import text

def seed_coaches_and_availabilities():
    coaches = [
        {
            "first_name": "Derek",
            "last_name": "Lin",
            "rate": 100,
            "bio": "Hello my name is Derek and I am a local Irvine tennis coach with over 20 years of playing experience and over 16 years of teaching experience! I achieved a Top 75 national ranking back in juniors. I was the #1 singles player for the national club team at UC Davis (which is my alma mater and after graduating, I also played on the Irvine Valley College’s 3-Time State Championship Team). I was the Assistant Varsity Coach for Northwood High School for two years, privately coached tennis for about 10 years and have coached at numerous tennis academies. This past year (2022-2023) I had one student win CIF Division 1 (Portola High School), another win CIF Division 2 (Sage Hill), and another was a finalist of CIF Division 2 (J. Serra) so I’m confident that my student’s experience success at the highest high school level. I pride myself in having 100% success rate of students entering the high school tennis team (Frosh, JV, Varsity).",
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
        {
            "first_name": "Roger",
            "last_name": "Federer",
            "rate": 1000,
            "bio": "Hi, I’m Roger Federer, a professional tennis player with over two decades of experience competing at the highest level. Throughout my career, I’ve won 20 Grand Slam singles titles and have held the No. 1 spot in the ATP rankings for a record 310 weeks. My passion for tennis goes beyond competition—I love sharing my knowledge and expertise with others. Whether you're just starting out or looking to refine your skills, I’m excited to help you elevate your game on the court. I also speak Swiss, German, and French and can coach in those languages if you prefer.",
            "location": "San Francisco",
            "image_url": "/images/coach_profile_image/Coach-Roger-Federer.jpeg",
            "experience_years": 20,
            "availabilities": [
                {"day_of_week": "Friday", "start_time": "10:00", "end_time": "20:00"},
                {"day_of_week": "Saturday", "start_time": "10:00", "end_time": "20:00"},
                {"day_of_week": "Sunday", "start_time": "10:00", "end_time": "20:00"}
            ]
        },
        {
            "first_name": "Kei",
            "last_name": "Nishikori",
            "rate": 500,
            "bio": "Hi, I’m Kei Nishikori, a professional tennis player from Japan. Over the course of my career, I’ve reached a career-high singles ranking of No. 4 in the world and have made it to the finals of the US Open. I’m the first Asian male to compete in a Grand Slam final, and I have won 12 ATP Tour titles. With a passion for the game and a deep understanding of professional-level tennis, I’m here to help you improve your technique and mindset on the court. I can coach in Japanese if you prefer. Arigatou!",
            "location": "Los Angeles", 
            "image_url": "/images/coach_profile_image/Coach-Nishikori.jpeg",
            "experience_years": 15,
            "availabilities": [
                {"day_of_week": "Monday", "start_time": "16:00", "end_time": "22:00"},
                {"day_of_week": "Tuesday", "start_time": "16:00", "end_time": "22:00"},
                {"day_of_week": "Wednesday", "start_time": "16:00", "end_time": "22:00"}
            ]
        },
        {
            "first_name": "Carlos",
            "last_name": "Alcaraz",
            "rate": 1500,
            "bio": "Hola! My name is Carlos Alcaraz, and I am a professional tennis player from Spain. As the youngest player to reach the No. 1 spot in the ATP rankings, I have had the privilege of competing on the biggest stages in the world, including winning my first Grand Slam title at the US Open. With a powerful baseline game and relentless energy, I aim to inspire and mentor the next generation of tennis stars. Whether you're just starting or looking to refine your advanced skills, I am excited to help you reach your full potential on the court. I speak Spanish and would love to coach in both Spanish and English!",
            "location": "San Jose",
            "image_url": "/images/coach_profile_image/Coach-Carlos-Alcaraz.jpeg",
            "experience_years": 10,
            "availabilities": [
                {"day_of_week": "Monday", "start_time": "08:00", "end_time": "12:00"},
                {"day_of_week": "Tuesday", "start_time": "08:00", "end_time": "12:00"},
                {"day_of_week": "Wednesday", "start_time": "08:00", "end_time": "12:00"},
                {"day_of_week": "Thursday", "start_time": "08:00", "end_time": "12:00"},
                {"day_of_week": "Friday", "start_time": "08:00", "end_time": "12:00"},
                {"day_of_week": "Saturday", "start_time": "08:00", "end_time": "12:00"},
                {"day_of_week": "Sunday", "start_time": "08:00", "end_time": "12:00"},
            ]
        },
        {
            "first_name": "Kyle",
            "last_name": "Mccann",
            "rate": 80,
            "bio": "Sup my name's Kyle and I was a 4 year Division 1 athlete starter at UC Riverside from 2015-2019. During my time there, I had the record for all time singles and doubles combined wins. Currently I still compete in 5.0 mens leagues. In my free time I love to work out, golf, and travel. I only speak English but can do an awesome Irish accent if you prefer. Excited to work with you! ",
            "location": "Irvine",
            "image_url": "/images/coach_profile_image/Coach-Kyle.jpeg",
            "experience_years": 8,
            "availabilities": [
                {"day_of_week": "Monday", "start_time": "08:00", "end_time": "12:00"},
                {"day_of_week": "Tuesday", "start_time": "08:00", "end_time": "12:00"},
                {"day_of_week": "Wednesday", "start_time": "08:00", "end_time": "12:00"},
                {"day_of_week": "Thursday", "start_time": "08:00", "end_time": "12:00"},
                {"day_of_week": "Friday", "start_time": "08:00", "end_time": "12:00"},
                {"day_of_week": "Saturday", "start_time": "08:00", "end_time": "12:00"},
                {"day_of_week": "Sunday", "start_time": "08:00", "end_time": "12:00"},
            ]
        },
        {
            "first_name": "Ovidiu",
            "last_name": "Fritsch",
            "rate": 90,
            "bio": "Hey everyone, my name's Ovidiu, Ovi for short, and I've been playing tennis for 20 years but coaching for 5. I'm originally from Romania, but grew up in Canada. I played on the national club team at UC Davis and was one of the top players there.  In my free time, I enjoy running, coding, and hanging out with friends. Please reach out and see how I can help you transform your tennis! ",
            "location": "San Francisco",
            "image_url": "/images/coach_profile_image/Coach-Ovidiu.jpeg",
            "experience_years": 5,
            "availabilities": [
                {"day_of_week": "Monday", "start_time": "08:00", "end_time": "12:00"},
                {"day_of_week": "Tuesday", "start_time": "08:00", "end_time": "12:00"},
                {"day_of_week": "Wednesday", "start_time": "08:00", "end_time": "12:00"},
                {"day_of_week": "Thursday", "start_time": "08:00", "end_time": "12:00"},
                {"day_of_week": "Friday", "start_time": "08:00", "end_time": "12:00"},
                {"day_of_week": "Saturday", "start_time": "08:00", "end_time": "12:00"},
                {"day_of_week": "Sunday", "start_time": "08:00", "end_time": "12:00"},
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
