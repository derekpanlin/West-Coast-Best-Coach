from flask.cli import AppGroup
from .users import seed_users, undo_users
from .coaches_and_availabilities import seed_coaches_and_availabilities, undo_coaches_and_availabilities
from .bookings import seed_all_bookings, undo_all_bookings

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_all_bookings()  # Undo bookings first
        undo_coaches_and_availabilities()  # Then undo coaches and availabilities
        undo_users()  # Undo users last

    seed_users()
    seed_coaches_and_availabilities()
    seed_all_bookings()

    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_all_bookings()  # Undo bookings first
    undo_coaches_and_availabilities()  # Then undo coaches and availabilities
    undo_users()  # Undo users last
    # Add other undo functions here
