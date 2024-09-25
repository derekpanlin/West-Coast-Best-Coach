from app.models import db, Coach, Availability, environment, SCHEMA
from sqlalchemy.sql import text

def seed_coaches_and_availabilities():
    coaches = [
        {
            "first_name": "Derek",
            "last_name": "Lin",
            "rate": 100,
            "bio": "Hello my name is Derek and I am a local Irvine tennis coach with over 20 years of playing experience and over 16 years of teaching experience! I achieved a Top 75 national ranking back in juniors. I was the #1 singles player for the national club team at UC Davis (which is my alma mater and after graduating, I also played on the Irvine Valley College’s 3-Time State Championship Team). I was the Assistant Varsity Coach for Northwood High School for two years, privately coached tennis for about 10 years and have coached at numerous tennis academies. This past year (2022-2023) I had one student win CIF Division 1 (Portola High School), another win CIF Division 2 (Sage Hill), and another was a finalist of CIF Division 2 (J. Serra) so I’m confident that my student’s experience success at the highest high school level. I pride myself in having 100% success rate of students entering the high school tennis team (Frosh, JV, Varsity). I'm fluent in Chinese too if you prefer that instead. Hope to hear from you!",
            "location": "Irvine",
            "image_url": "/images/coach_profile_image/Coach-Derek-Lin.jpeg",
            "experience_years": 16,
            "availabilities": [
                {"day_of_week": "Monday", "start_time": "08:00", "end_time": "12:00"},
                {"day_of_week": "Tuesday", "start_time": "08:00", "end_time": "12:00"}
            ]
        },
        {
            "first_name": "Rouzbeh",
            "last_name": "Kamran",
            "rate": 150,
            "bio": "My name Coach Rouzbeh and I am a professional tennis player from Iran. I have played in the Davis Cup representing Iran, and was the #1 player in Iran for many years. I now live in Irvine and have coached all kinds of students to the highest level. One of my students recently got a full ride to play Division 1 at UPenn. I speak Arabic as well and look forward to working with you.",
            "location": "Irvine",
            "image_url": "/images/coach_profile_image/Coach-Rouzbeh-Kamran.jpeg",
            "experience_years": 30,
            "availabilities": [
                {"day_of_week": "Monday", "start_time": "16:00", "end_time": "20:00"},
                {"day_of_week": "Tuesday", "start_time": "16:00", "end_time": "20:00"},
                {"day_of_week": "Wednesday", "start_time": "16:00", "end_time": "20:00"},
                {"day_of_week": "Thursday", "start_time": "16:00", "end_time": "20:00"},
                {"day_of_week": "Friday", "start_time": "19:00", "end_time": "21:00"},
                {"day_of_week": "Saturday", "start_time": "19:00", "end_time": "21:00"},
            ]
        },
        {
            "first_name": "Roger",
            "last_name": "Federer",
            "rate": 1000000,
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
                {"day_of_week": "Monday", "start_time": "16:00", "end_time": "20:00"},
                {"day_of_week": "Tuesday", "start_time": "16:00", "end_time": "20:00"},
                {"day_of_week": "Wednesday", "start_time": "16:00", "end_time": "20:00"}
            ]
        },
        {
            "first_name": "Carlos",
            "last_name": "Alcaraz",
            "rate": 150000,
            "bio": "Hola! My name is Carlos Alcaraz, and I am a professional tennis player from Spain. As the youngest player to reach the No. 1 spot in the ATP rankings, I have had the privilege of competing on the biggest stages in the world, including winning my first Grand Slam title at the US Open. With a powerful baseline game and relentless energy, I aim to inspire and mentor the next generation of tennis stars. Whether you're just starting or looking to refine your advanced skills, I am excited to help you reach your full potential on the court. I speak Spanish and would love to coach in both Spanish and English!",
            "location": "San Jose",
            "image_url": "/images/coach_profile_image/Coach-Carlos-Alcaraz.jpeg",
            "experience_years": 10,
            "availabilities": [
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
            ]
        },
        {
            "first_name": "Ovidiu",
            "last_name": "Fritsch",
            "rate": 90,
            "bio": "What’s up! I’m Ovi, quite possibly the greatest tennis player of all time who can also run a marathon in under 3 hours! I owe it all to my Romanian and Canadian roots, in particular to the traditional romanian creamy spinach dish my grandmother used to make. How else would you explain these guns 💪 🥦? When i’m not ripping forehand winners from 5 feet behind the baseline or lapping peasants on the track, you can find me reading in bed, coding, walking around, or chilling on the couch with a blue gatorade and a nice home cooked meal, recovering from the day’s activity.",
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
            ],
            
        },
        {
            "first_name": "Jannik",
            "last_name": "Sinner",
            "rate": 2000,
            "bio": "Hi, I’m Jannik Sinner, a professional tennis player from Italy. At a young age, I’ve already made a significant impact on the ATP Tour, reaching the quarterfinals or better in all Grand Slam tournaments and winning multiple ATP titles. Known for my powerful groundstrokes and mental toughness, I’ve been ranked as high as World No. 4 and continue to rise in the tennis world. Whether you're looking to refine your technique or take your game to the next level, I’m excited to help you reach your goals on the court. I speak both Italian and English, and I’m happy to coach in either language.",
            "location": "Los Angeles",
            "image_url": "/images/coach_profile_image/Coach-Jannik-Sinner.jpeg",
            "experience_years": 10,
            "availabilities": [
                {"day_of_week": "Monday", "start_time": "12:00", "end_time": "16:00"},
                {"day_of_week": "Wednesday", "start_time": "12:00", "end_time": "16:00"},
                {"day_of_week": "Friday", "start_time": "12:00", "end_time": "16:00"}
            ]
        },
        {
            "first_name": "Rafael",
            "last_name": "Nadal",
            "rate": 2500,
            "bio": "Hola! I’m Rafael Nadal, a professional tennis player from Spain with over 20 Grand Slam titles to my name. Known as the 'King of Clay,' I've spent decades at the top of the ATP rankings. My experience on the court and unmatched mental toughness have brought me success on all surfaces. Whether you're an advanced player looking to master your technique or a beginner, I'm excited to help you excel in your tennis journey. I’m fluent in both Spanish and English, and I’m happy to coach in either language.",
            "location": "Irvine",
            "image_url": "/images/coach_profile_image/Coach-Rafael-Nadal.jpeg",
            "experience_years": 22,
            "availabilities": [
                {"day_of_week": "Monday", "start_time": "08:00", "end_time": "12:00"},
                {"day_of_week": "Wednesday", "start_time": "08:00", "end_time": "12:00"},
                {"day_of_week": "Friday", "start_time": "08:00", "end_time": "12:00"}
            ]
        },
        {
            "first_name": "Andy",
            "last_name": "Roddick",
            "rate": 1500,
            "bio": "Hey there! I’m Andy Roddick, a former World No. 1 tennis player from the USA. I was known for my powerful serve and competitive spirit, winning the US Open in 2003. I bring years of experience at the highest levels of the game and look forward to sharing my knowledge with players of all skill levels. Whether you're looking to improve your serve or sharpen your overall game, I’m here to help. I’m also an engaging instructor who loves making tennis fun.",
            "location": "Los Angeles",
            "image_url": "/images/coach_profile_image/Coach-Andy-Roddick.jpeg",
            "experience_years": 20,
            "availabilities": [
                {"day_of_week": "Tuesday", "start_time": "12:00", "end_time": "16:00"},
                {"day_of_week": "Thursday", "start_time": "12:00", "end_time": "16:00"},
                {"day_of_week": "Saturday", "start_time": "12:00", "end_time": "16:00"}
            ]
        },
        {
            "first_name": "Denis",
            "last_name": "Shapovalov",
            "rate": 1200,
            "bio": "Hi, I’m Denis Shapovalov, a professional tennis player from Canada. I’ve been recognized for my aggressive game style and flashy one-handed backhand. I’ve competed at the highest levels of the ATP Tour and am excited to share my insights on modern tennis techniques. Whether you’re a competitive player or just looking to improve your skills, I’m here to help. I also speak Russian and would love to coach in either English or Russian.",
            "location": "San Francisco",
            "image_url": "/images/coach_profile_image/Coach-Denis-Shapovalov.jpeg",
            "experience_years": 8,
            "availabilities": [
                {"day_of_week": "Monday", "start_time": "10:00", "end_time": "14:00"},
                {"day_of_week": "Tuesday", "start_time": "10:00", "end_time": "14:00"},
                {"day_of_week": "Friday", "start_time": "10:00", "end_time": "14:00"}
            ]
        },
        {
            "first_name": "Grigor",
            "last_name": "Dimitrov",
            "rate": 1100,
            "bio": "Hello! I’m Grigor Dimitrov, a professional tennis player from Bulgaria. Throughout my career, I’ve been known for my smooth all-court game and elegant one-handed backhand. I’ve reached the semifinals in multiple Grand Slam tournaments and competed against the top players in the world. Whether you're a junior player or an adult looking to refine your game, I’m here to help you improve every aspect of your play. I speak both Bulgarian and English, so feel free to choose whichever language you're comfortable with!",
            "location": "Irvine",
            "image_url": "/images/coach_profile_image/Coach-Grigor-Dimitrov.jpeg",
            "experience_years": 12,
            "availabilities": [
                {"day_of_week": "Tuesday", "start_time": "08:00", "end_time": "12:00"},
                {"day_of_week": "Thursday", "start_time": "08:00", "end_time": "12:00"},
                {"day_of_week": "Saturday", "start_time": "08:00", "end_time": "12:00"}
            ]
        },
        {
            "first_name": "Daniil",
            "last_name": "Medvedev",
            "rate": 1800,
            "bio": "Hi, I’m Daniil Medvedev, a professional tennis player from Russia. Known for my counter-punching style and incredible defense, I’ve been a mainstay in the top rankings of the ATP Tour. I’ve won multiple Masters 1000 titles and a Grand Slam, and I’m eager to share my expertise with players of all skill levels. I’m fluent in Russian and English, and I’d be happy to coach in either language.",
            "location": "San Jose",
            "image_url": "/images/coach_profile_image/Coach-Daniil-Medvedev.jpeg",
            "experience_years": 12,
            "availabilities": [
                {"day_of_week": "Monday", "start_time": "09:00", "end_time": "13:00"},
                {"day_of_week": "Wednesday", "start_time": "09:00", "end_time": "13:00"},
                {"day_of_week": "Friday", "start_time": "09:00", "end_time": "13:00"}
            ]
        },
        {
            "first_name": "Naomi",
            "last_name": "Osaka",
            "rate": 1700,
            "bio": "Hi, I’m Naomi Osaka, a professional tennis player from Japan. I’ve won four Grand Slam titles and have been ranked as high as World No. 1. I’m passionate about mental health and empowering others both on and off the court. Whether you’re just starting out or aiming to compete at a high level, I’m excited to work with you on your journey. I’m fluent in both Japanese and English and can coach in either language.",
            "location": "San Jose",
            "image_url": "/images/coach_profile_image/Coach-Naomi-Osaka.jpeg",
            "experience_years": 9,
            "availabilities": [
                {"day_of_week": "Tuesday", "start_time": "10:00", "end_time": "14:00"},
                {"day_of_week": "Thursday", "start_time": "10:00", "end_time": "14:00"},
                {"day_of_week": "Saturday", "start_time": "10:00", "end_time": "14:00"}
            ]
        }
        
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
