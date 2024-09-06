import { REMOVE_USER } from "./session";
const SET_COACHES = 'coaches/setCoaches';
const SET_COACH = 'coaches/setCoach';
const CLEAR_COACHES = 'coaches/clearCoaches';


// Action Creator to set coaches
const setCoaches = (coaches) => ({
    type: SET_COACHES,
    payload: coaches
});

// Action Creator to set a specific coach
const setCoach = (coach) => ({
    type: SET_COACH,
    payload: coach
});

// Clear coaches
export const clearCoaches = () => ({
    type: CLEAR_COACHES
});

// Thunk to fetch all coaches
export const fetchCoaches = () => async (dispatch) => {
    try {
        const response = await fetch('/api/coaches');

        if (response.ok) {
            const data = await response.json();
            dispatch(setCoaches(data.coaches));
            return data.coaches;
        } else {
            const errorMessages = await response.json();
            console.error('Failed to fetch coaches:', errorMessages);
            return null;
        }
    } catch (error) {
        console.error('Error fetching coaches:', error);
        return null;
    }
};

// Thunk to fetch a specific coach by ID
export const fetchCoachById = (id) => async (dispatch) => {
    try {
        const response = await fetch(`/api/coaches/${id}`);
        if (response.ok) {
            const data = await response.json();
            dispatch(setCoach(data));
        } else {
            const errorMessages = await response.json();
            console.error('Coach not found:', errorMessages);
        }
    } catch (error) {
        console.error('Error fetching coach:', error);
    }
};

// Thunk to fetch coaches by city
export const fetchCoachesByCity = (city) => async (dispatch) => {
    try {
        const response = await fetch(`/api/coaches?city=${encodeURIComponent(city)}`);
        if (response.ok) {
            const data = await response.json();
            dispatch(setCoaches(data.coaches));
        } else {
            const errorMessages = await response.json();
            // Handle errors directly here or return them
            console.error('Failed to fetch coaches for the city:', errorMessages);
        }
    } catch (error) {
        console.error('Error:', error.message)
    }
};

// Reducer
const initialState = { coaches: {} }

export const coachReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_COACHES: {
            const newState = { ...state, coaches: { ...state.coaches } };
            action.payload.forEach(coach => {
                newState.coaches[coach.id] = coach;
            });
            return newState;
        }
        case SET_COACH: {
            return {
                ...state,
                coaches: {
                    ...state.coaches,
                    [action.payload.id]: action.payload  // Add/update the specific coach
                }
            };
        }
        case CLEAR_COACHES: {
            return {
                ...state,
                coaches: {}
            }
        }
        case REMOVE_USER: {
            return {
                coaches: {}
            }
        }
        default:
            return state;
    }
}

export default coachReducer;
