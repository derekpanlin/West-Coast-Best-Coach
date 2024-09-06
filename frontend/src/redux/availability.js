// redux/availability.js

// Action Types
const SET_AVAILABILITY = 'availability/SET_AVAILABILITY'
const CLEAR_AVAILABILITY = 'availability/CLEAR_AVAILABILITY';


// Action creators

export const setAvailability = (coachId, availability) => ({
    type: SET_AVAILABILITY,
    payload: {
        coachId,
        availability,
    },
});

export const clearAvailability = (coachId) => ({
    type: CLEAR_AVAILABILITY,
    payload: coachId
})


// Thunks
export const fetchAvailabilityThunk = (coachId) => async (dispatch) => {
    const response = await fetch(`/api/coaches/${coachId}/availability`)

    if (response.ok) {
        const data = await response.json();
        const availability = data.availability;
        dispatch(setAvailability(coachId, availability))
    }
}

// Reducer
const initialState = {}

export default function availabilityReducer(state = initialState, action) {
    switch (action.type) {
        case SET_AVAILABILITY: {
            const { coachId, availability } = action.payload;
            return {
                ...state,
                [coachId]: availability
            };
        }
        case CLEAR_AVAILABILITY: {
            const newState = { ...state };
            delete newState[action.payload];
            return newState;
        }
        default:
            return state;
    }
}
