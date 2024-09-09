// Action Types
const CREATE_BOOKING = 'bookings/CREATE_BOOKING'
const GET_BOOKINGS = 'bookings/GET_BOOKINGS'
const GET_BOOKING = 'bookings/GET_BOOKING'
const GET_BOOKINGS_FOR_DATE = 'bookings/GET_BOOKINGS_FOR_DATE'
const UPDATE_BOOKING = 'bookings/UPDATE_BOOKING'
const DELETE_BOOKING = 'bookings/DELETE_BOOKING'

// Action Creators
export const createBooking = (bookings) => ({
    type: CREATE_BOOKING,
    payload: bookings // Array of bookings
})

export const getBookings = (bookings) => ({
    type: GET_BOOKINGS,
    payload: bookings
})

export const getBooking = (booking) => ({
    type: GET_BOOKING,
    payload: booking
})

export const getBookingsForDate = (bookings, coachId, date) => ({
    type: GET_BOOKINGS_FOR_DATE,
    payload: { bookings, coachId, date }
})

export const updateBooking = (bookings) => ({
    type: UPDATE_BOOKING,
    payload: bookings // Array of bookings too
})

export const deleteBooking = (bookingId) => ({
    type: DELETE_BOOKING,
    payload: bookingId
})

// Thunks
export const createBookingThunk = (bookings) => async (dispatch) => {
    const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookings)
    })

    if (response.ok) {
        const newBookings = await response.json();
        dispatch(createBooking(newBookings.bookings));
        return newBookings;
    } else {
        const errors = await response.json()
        return errors;
    }
}

export const getBookingsThunk = () => async (dispatch) => {
    const response = await fetch('/api/bookings');

    if (response.ok) {
        const data = await response.json();
        dispatch(getBookings(data.bookings));
        return data.bookings;
    } else {
        const errors = await response.json();
        return errors;
    }
};

export const getBookingThunk = (bookingId) => async (dispatch) => {
    const response = await fetch(`/api/bookings/${bookingId}`);

    if (response.ok) {
        const booking = await response.json();
        dispatch(getBooking(booking))
        return booking;
    } else {
        const errors = await response.json();
        return errors;
    }
}

// Fetch bookings for a specific coach on a specific date
export const fetchBookingsThunk = (coachId, date) => async (dispatch) => {
    const formattedDate = date.toISOString().split('T')[0];  // Format date as 'YYYY-MM-DD'
    const response = await fetch(`/api/coaches/${coachId}/bookings?date=${formattedDate}`);

    if (response.ok) {
        const bookings = await response.json();
        dispatch(getBookingsForDate(bookings, coachId, formattedDate));  // Dispatch the action to store bookings for this date
        return bookings;
    } else {
        const errors = await response.json();
        return errors;
    }
};

export const updateBookingThunk = (bookingId, updatedData) => async (dispatch) => {
    console.log('Sending updated booking data:', updatedData);

    const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData)  // Send the updated booking data
    });

    if (response.ok) {
        const updatedBooking = await response.json();
        console.log('Updated booking received:', updatedBooking);

        dispatch(updateBooking([updatedBooking]));  // Dispatch the updated booking to the store
        return updatedBooking;
    } else {
        const errors = await response.json();
        console.log('Update errors:', errors);
        return errors;
    }
}

export const deleteBookingThunk = (bookingId) => async (dispatch) => {
    const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        dispatch(deleteBooking(bookingId));
        return 'Booking successfully deleted'
    } else {
        const errors = await response.json();
        return errors
    }
}

const initialState = { bookings: {}, singleBooking: {}, bookingsByDate: {} };

export const bookingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_BOOKING: {
            const newState = { ...state, bookings: { ...state.bookings } };
            // Loop through each booking in the payload array
            action.payload.forEach(booking => {
                newState.bookings[booking.id] = booking;  // Add each booking to the state
            });

            return newState;
        }
        case GET_BOOKINGS: {
            const newState = { ...state, bookings: {} };
            action.payload.forEach((booking) => {
                newState.bookings[booking.id] = booking;
            });
            return newState;
        }
        case GET_BOOKING: {
            return {
                ...state,
                singleBooking: action.payload,
            };
        }
        case GET_BOOKINGS_FOR_DATE: {
            const newState = { ...state };
            if (!newState.bookingsByDate[action.payload.coachId]) {
                newState.bookingsByDate[action.payload.coachId] = {};
            }
            newState.bookingsByDate[action.payload.coachId][action.payload.date] = action.payload.bookings;
            return newState;
        }
        case UPDATE_BOOKING: {
            const newState = { ...state, bookings: { ...state.bookings } };

            const updatedBooking = action.payload;  // Now it's a single booking object

            // Update the booking in the bookings state
            newState.bookings[updatedBooking.id] = updatedBooking;

            // If the singleBooking is being updated, ensure it's also updated
            if (state.singleBooking.id === updatedBooking.id) {
                newState.singleBooking = updatedBooking;
            }

            return newState;
        }
        case DELETE_BOOKING: {
            const newState = { ...state, bookings: { ...state.bookings } };
            delete newState.bookings[action.payload];
            if (state.singleBooking.id === action.payload) {
                newState.singleBooking = {};
            }
            return newState;
        }
        default:
            return state;
    }
};
