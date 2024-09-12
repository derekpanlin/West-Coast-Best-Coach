
// Action Type
const FETCH_REVIEWS_BY_COACH = 'reviews/FETCH_REVIEWS_BY_COACH';
const FETCH_REVIEWS_BY_USER = 'reviews/FETCH_REVIEWS_BY_USER'
const CLEAR_REVIEWS = 'reviews/CLEAR_REVIEWS'
const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';

// Action Creators

const fetchReviewsByCoach = (reviews) => ({
    type: FETCH_REVIEWS_BY_COACH,
    payload: reviews
});

const fetchReviewsByUser = (reviews) => ({
    type: FETCH_REVIEWS_BY_USER,
    payload: reviews
});

export const clearReviews = () => ({
    type: CLEAR_REVIEWS,
});

const createReview = (review) => ({
    type: CREATE_REVIEW,
    payload: review
});

const updateReview = (review) => ({
    type: UPDATE_REVIEW,
    payload: review
});

const deleteReview = (reviewId) => ({
    type: DELETE_REVIEW,
    payload: reviewId
});

// Thunk
export const fetchReviewsByCoachThunk = (coachId) => async (dispatch) => {
    const response = await fetch(`/api/reviews/coach/${coachId}`);

    if (response.ok) {
        const data = await response.json()
        dispatch(fetchReviewsByCoach(data.reviews));
        return data;
    }
};

export const fetchReviewsByUserThunk = () => async (dispatch) => {
    const response = await fetch('/api/reviews/user');

    if (response.ok) {
        const data = await response.json();
        dispatch(fetchReviewsByUser(data.reviews));
        return data;
    }
};

export const createReviewThunk = (reviewData) => async (dispatch) => {
    const response = await fetch(`/api/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(createReview(data));
        return data;
    }
};

export const updateReviewThunk = (reviewId, reviewData) => async (dispatch) => {
    const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(updateReview(data));
        return data;
    }
};

export const deleteReviewThunk = (reviewId) => async (dispatch) => {
    const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        dispatch(deleteReview(reviewId));
    }
};

const initialState = {
    coachReviews: {},
    userReviews: {}
}

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_REVIEWS_BY_COACH:
            const coachReviewsState = {};
            action.payload.forEach((review) => {
                coachReviewsState[review.id] = review
            });
            return { ...state, coachReviews: coachReviewsState };
        case FETCH_REVIEWS_BY_USER:
            const userReviewsState = {};
            action.payload.forEach((review) => {
                userReviewsState[review.id] = review
            });
            return { ...state, userReviews: userReviewsState }
        case CLEAR_REVIEWS:
            return {}
        default:
            return state;
    }
}
export default reviewReducer;
