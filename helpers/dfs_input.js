module.exports = dfs_input = (flightroutes) => {
    let unorder_itineraries = [];
    for(let flightroute of flightroutes)
    {
        let itinerary = [];
        itinerary.push(flightroute.origin);
        itinerary.push(flightroute.destination);
        unorder_itineraries.push(itinerary);
    }
    return unorder_itineraries;
}