
mapboxgl.accessToken = 'pk.eyJ1Ijoic3BvcnR5amFtZXMiLCJhIjoiY2twaHQxd3p6MDI0YjJwczFqYWd1MW83eSJ9.Ec5CD2tM6R-F812BnoCYvA';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center: [-96, 37.8],
zoom: 3
});



// psuedocode
// let count = 0;
// for(let flightroute of flightroutesCopy){
//     origin = flightroute.origin;
//     destination = flightroute.destination; 
//     window['route' + count] = {
//     'type': 'FeatureCollection',
//     'features': [
//         {
//             'type': 'Feature',
//             'geometry': {
//                 'type': 'LineString',
//                 'coordinates': [origin, destination]
//             }
//         }
//         ]
//     };
//     var point = {
//     'type': 'FeatureCollection',
//     'features': [
//         {
//             'type': 'Feature',
//             'properties': {},
//             'geometry': {
//                 'type': 'Point',
//                 'coordinates': origin
//             }
//         }
//         ]
//     };
// }

//







// San Francisco
var origin = [-122.414, 37.776];

// Washington DC
var destination = [-77.032, 38.913];


// some ori
var origin2 = [-77.032, 38.913];
// some des
var destination2 = [-95.3698, 29.7604];


// A simple line from origin to destination.
var route = {
    'type': 'FeatureCollection',
    'features': [
        {
            'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'coordinates': [origin, destination]
            }
        }
    ]
};

// A simple line from origin2 to destination2.
var route2 = {
    'type': 'FeatureCollection',
    'features': [
        {
            'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'coordinates': [origin2, destination2]
            }
        }
    ]
};


// A single point that animates along the route.
// Coordinates are initially set to origin.
var point = {
    'type': 'FeatureCollection',
    'features': [
        {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'Point',
                'coordinates': origin
            }
        }
    ]
};

// A single point that animates along the route.
// Coordinates are initially set to origin.
var point2 = {
    'type': 'FeatureCollection',
    'features': [
        {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'Point',
                'coordinates': origin2
            }
        }
    ]
};




// Calculate the distance in kilometers between route start/end point.
var lineDistance = turf.length(route.features[0]);

// Calculate the distance in kilometers between route start/end point.
var lineDistance2 = turf.length(route2.features[0]);

var arc = [];

var arc2 = [];

// Number of steps to use in the arc and animation, more steps means
// a smoother arc and animation, but too many steps will result in a
// low frame rate
var steps = 500;

// Draw an arc between the `origin` & `destination` of the two points
for (var i = 0; i < lineDistance; i += lineDistance / steps) {
    var segment = turf.along(route.features[0], i);
    arc.push(segment.geometry.coordinates);
}

// Draw an arc between the `origin` & `destination` of the two points
for (var i = 0; i < lineDistance2; i += lineDistance2 / steps) {
    var segment = turf.along(route2.features[0], i);
    arc2.push(segment.geometry.coordinates);
}

// Update the route with calculated arc coordinates
route.features[0].geometry.coordinates = arc;

// Update the route with calculated arc coordinates
route2.features[0].geometry.coordinates = arc2;

// Used to increment the value of the point measurement against the route.
var counter = 0;

// Used to increment the value of the point measurement against the route.
var counter2 = 0;

map.on('load', function () {
    // Add a source and layer displaying a point which will be animated in a circle.
    map.addSource('route', {
        'type': 'geojson',
        'data': route
    });
    
    map.addSource('route2', {
        'type': 'geojson',
        'data': route2
    });

    map.addSource('point', {
        'type': 'geojson',
        'data': point
    });
    
    map.addSource('point2', {
        'type': 'geojson',
        'data': point2
    });

    map.addLayer({
        'id': 'route',
        'source': 'route',
        'type': 'line',
        'paint': {
            'line-width': 2,
            'line-color': '#007cbf'
        }
    });
    
    map.addLayer({
        'id': 'route2',
        'source': 'route2',
        'type': 'line',
        'paint': {
            'line-width': 2,
            'line-color': '#007cbf'
        }
    });

    map.addLayer({
        'id': 'point',
        'source': 'point',
        'type': 'symbol',
        'layout': {
            // This icon is a part of the Mapbox Streets style.
            // To view all images available in a Mapbox style, open
            // the style in Mapbox Studio and click the "Images" tab.
            // To add a new image to the style at runtime see
            // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
            'icon-image': 'airport-15',
            'icon-rotate': ['get', 'bearing'],
            'icon-rotation-alignment': 'map',
            'icon-allow-overlap': true,
            'icon-ignore-placement': true
        }
    });
    
    map.addLayer({
        'id': 'point2',
        'source': 'point2',
        'type': 'symbol',
        'layout': {
            // This icon is a part of the Mapbox Streets style.
            // To view all images available in a Mapbox style, open
            // the style in Mapbox Studio and click the "Images" tab.
            // To add a new image to the style at runtime see
            // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
            'icon-image': 'airport-15',
            'icon-rotate': ['get', 'bearing'],
            'icon-rotation-alignment': 'map',
            'icon-allow-overlap': true,
            'icon-ignore-placement': true
        }
    });

    function animate() {
        var start =
            route.features[0].geometry.coordinates[
                counter >= steps ? counter - 1 : counter
            ];
        var end =
            route.features[0].geometry.coordinates[
                counter >= steps ? counter : counter + 1
            ];
        if (!start || !end) return;

        // Update point geometry to a new position based on counter denoting
        // the index to access the arc
        point.features[0].geometry.coordinates =
            route.features[0].geometry.coordinates[counter];

        // Calculate the bearing to ensure the icon is rotated to match the route arc
        // The bearing is calculated between the current point and the next point, except
        // at the end of the arc, which uses the previous point and the current point
        point.features[0].properties.bearing = turf.bearing(
            turf.point(start),
            turf.point(end)
        );

        // Update the source with this new data
        map.getSource('point').setData(point);

        // Request the next frame of animation as long as the end has not been reached
        if (counter < steps) {
            requestAnimationFrame(animate);
        }

        counter = counter + 1;
    }
    
    function animate2() {
        var start2 =
            route2.features[0].geometry.coordinates[
                counter2 >= steps ? counter2 - 1 : counter2
            ];
        var end2 =
            route2.features[0].geometry.coordinates[
                counter2 >= steps ? counter2 : counter2 + 1
            ];
        if (!start2 || !end2) return;

        // Update point geometry to a new position based on counter denoting
        // the index to access the arc
        point2.features[0].geometry.coordinates =
            route2.features[0].geometry.coordinates[counter2];

        // Calculate the bearing to ensure the icon is rotated to match the route arc
        // The bearing is calculated between the current point and the next point, except
        // at the end of the arc, which uses the previous point and the current point
        point2.features[0].properties.bearing = turf.bearing(
            turf.point(start2),
            turf.point(end2)
        );

        // Update the source with this new data
        map.getSource('point2').setData(point2);

        // Request the next frame of animation as long as the end has not been reached
        if (counter2 < steps) {
            requestAnimationFrame(animate2);
        }

        counter2 = counter2 + 1;
    }

    document
        .getElementById('flight1')
        .addEventListener('click', function () {
            // Set the coordinates of the original point back to origin
            point.features[0].geometry.coordinates = origin;

            // Update the source layer
            map.getSource('point').setData(point);

            // Reset the counter
            counter = 0;

            // Restart the animation
            animate(counter);
        });
    
            document
        .getElementById('flight2')
        .addEventListener('click', function () {
            // Set the coordinates of the original point back to origin
            point.features[0].geometry.coordinates = origin;

            // Update the source layer
            map.getSource('point').setData(point);

            // Reset the counter
            counter2 = 0;

            // Restart the animation
            animate2(counter2);
        });

    // Start the animation
//         animate(counter);
    
//         animate2(counter2);
});
