// Action Types
const CREATE_BOOKING = 'bookings/CREATE_BOOKING'
const GET_BOOKINGS = 'bookings/GET_BOOKINGS'
const GET_BOOKING = 'bookings/GET_BOOKING'
const UPDATE_BOOKING = 'bookings/UPDATE_BOOKING'
const DELETE_BOOKING = 'bookings/DELETE_BOOKING'

// Action Creators
export const createBooking = (booking) => ({
    type: CREATE_BOOKING,
    payload: booking
})

export const getBookings = (bookings) => ({
    type: GET_BOOKINGS,
    payload: bookings
})

export const getBooking = (booking) => ({
    type: GET_BOOKING,
    payload: booking
})

export const updateBooking = (booking) => ({
    type: UPDATE_BOOKING,
    payload: booking
})

export const deleteBooking = (bookingId) => ({
    type: DELETE_BOOKING,
    payload: bookingId
})

// Thunks
export const createBookingThunk = (booking) => async (dispatch) => {
    const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(booking)
    })

    if (response.ok) {
        const newBooking = await response.json();
        dispatch(createBooking(newBooking));
        return newBooking;
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

export const updateBookingThunk = (bookingId, updatedData) => async (dispatch) => {
    const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData)
    })

    if (response.ok) {
        const updatedBooking = await response.json();
        dispatch(updateBooking(updatedBooking));
        return updatedBooking;
    } else {
        const errors = await response.json();
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

const initialState = { bookings: {}, singleBooking: {} };

export const bookingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_BOOKING: {
            const newState = { ...state, bookings: { ...state.bookings } };
            newState.bookings[action.payload.id] = action.payload;
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
        case UPDATE_BOOKING: {
            const newState = { ...state, bookings: { ...state.bookings } };
            newState.bookings[action.payload.id] = action.payload;
            if (state.singleBooking.id === action.payload.id) {
                newState.singleBooking = action.payload;
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
