const INITIAL_STATE = {
    location: [0,0],
};

const markerReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_LOCATION':
            return {...state, location: action.location};
        case 'UPDATE_LOCATION':
            return INITIAL_STATE;
        default:
            return state;
    }
};

export default markerReducer;