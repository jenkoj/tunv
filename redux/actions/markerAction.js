const setMarkerLocationAction = location => ({
    type: 'SET_LOCATION',
    location,
});
const updateMarkerLocationAction = () => ({
    type: 'UPDATE_LOCATION',
});

export {setMarkerLocationAction, updateMarkerLocationAction};