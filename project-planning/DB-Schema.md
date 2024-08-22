# Database Schema

![DB Schema](../images/West%20Coach%20Best%20Coach.png)

# Tables

## Users Table
| Column          | Data Type      | Constraints              |
|-----------------|----------------|--------------------------|
| id              | int            | PRIMARY KEY, AUTO_INCREMENT |
| first_name      | varchar(200)   | NOT NULL                 |
| last_name       | varchar(200)   | NOT NULL                 |
| username        | varchar(200)   | NOT NULL, UNIQUE         |
| email           | varchar(200)   | NOT NULL, UNIQUE         |
| hashed_password | varchar(200)   | NOT NULL                 |
| created_at      | timestamp      | DEFAULT `now()`          |
| updated_at      | timestamp      | DEFAULT `now()`          |

## Coaches Table
| Column    | Data Type      | Constraints              |
|-----------|----------------|--------------------------|
| id        | int            | PRIMARY KEY, AUTO_INCREMENT |
| bio       | text           |                          |
| location  | varchar(200)   | NOT NULL                 |
| image_url | varchar(200)   |                          |
| created_at| timestamp      | DEFAULT `now()`          |
| updated_at| timestamp      | DEFAULT `now()`          |

## Bookings Table
| Column        | Data Type      | Constraints              |
|---------------|----------------|--------------------------|
| id            | int            | PRIMARY KEY, AUTO_INCREMENT |
| user_id       | int            | NOT NULL, FOREIGN KEY REFERENCES users(id) |
| coach_id      | int            | NOT NULL, FOREIGN KEY REFERENCES coaches(id) |
| location      | varchar(200)   | NOT NULL                 |
| booking_date  | date           | NOT NULL                 |
| start_time    | time           | NOT NULL                 |
| end_time      | time           | NOT NULL                 |
| created_at    | timestamp      | DEFAULT `now()`          |
| updated_at    | timestamp      | DEFAULT `now()`          |

## Availability Table
| Column        | Data Type      | Constraints              |
|---------------|----------------|--------------------------|
| id            | int            | PRIMARY KEY, AUTO_INCREMENT |
| coach_id      | int            | NOT NULL, FOREIGN KEY REFERENCES coaches(id) |
| day_of_week   | varchar(50)    | NOT NULL                 |
| time_of_day   | varchar(50)    | NOT NULL                 |
| start_time    | time           | NOT NULL                 |
| end_time      | time           | NOT NULL                 |

## Reviews Table
| Column        | Data Type      | Constraints              |
|---------------|----------------|--------------------------|
| id            | int            | PRIMARY KEY, AUTO_INCREMENT |
| user_id       | int            | NOT NULL, FOREIGN KEY REFERENCES users(id) |
| coach_id      | int            | NOT NULL, FOREIGN KEY REFERENCES coaches(id) |
| rating        | int            | NOT NULL                 |
| comment       | varchar(200)   | NOT NULL                 |
| created_at    | timestamp      | DEFAULT `now()`          |
| updated_at    | timestamp      | DEFAULT `now()`          | 
