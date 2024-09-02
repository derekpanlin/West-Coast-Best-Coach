// redux/availability.js

// Action Types
const SET_AVAILABILITY = 'avilability/SET_AVAILABILITY'


// Action creators

export const setAvailability = (coachId, availability) => ({
    type: SET_AVAILABILITY,
    payload: {
        coachId,
        availability,
    },
});

// Thunks
export const fetchAvailabilityThunk = (coachId) => async (dispatch) => {
    const response = await fetch(`/api/coaches/${coachId}/availability`)

    if (response.ok) {
        const availability = await response.json();
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
        default:
            return state;
    }
}
