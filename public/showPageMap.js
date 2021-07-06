mapboxgl.accessToken = 'pk.eyJ1Ijoic3BvcnR5amFtZXMiLCJhIjoiY2twaHQxd3p6MDI0YjJwczFqYWd1MW83eSJ9.Ec5CD2tM6R-F812BnoCYvA';

// Creating a map and Applying Some Styles to the map
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-96, 37.8],
    zoom: 3
});



let count = 1;
for(let j = 0; j < flightroutesCopy.length; j++){
    
    // obtain oriGeo and desGeo from each flightroute
    let oriGeo = flightroutesCopy[j].oriGeometry.coordinates;
    let desGeo = flightroutesCopy[j].desGeometry.coordinates; 

    // Object Route
    window['route' + count] = {
    'type': 'FeatureCollection',
    'features': [
        {
            'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'coordinates': [oriGeo, desGeo]
            }
        }
        ]
    };

    // Object Point 
    window['point' + count] = {
    'type': 'FeatureCollection',
    'features': [
        {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'Point',
                'coordinates': oriGeo
            }
        }
        ]
    };

    // Number of steps to use in the arc and animation, more steps means
    // a smoother arc and animation, but too many steps will result in a
    // low frame rate
    var arc = []
    var lineDistance = turf.length(window['route' + count].features[0]);

    // initialize the steps (indicate the speed)
    let SpeedSteps = 500;

    // Draw an arc between the `origin` & `destination` of the two points
    for (var i = 0; i < lineDistance; i += lineDistance / SpeedSteps) {
        var segment = turf.along(window['route' + count].features[0], i);
        arc.push(segment.geometry.coordinates);
    }

    // Update the route with calculated arc coordinates
    window['route' + count].features[0].geometry.coordinates = arc;

    // count increment: switch to the new object route and point
    count++;
}
    
// initialize the counter for each flight 
for(let index = 1; index <= flightroutesCopy.length; index++){
    window['counter' + index] = 0;
}

// Step 2
// Allocating the departure and destination airports
// Perform the animation of the plane in each route
map.on('load', function () {
    
    // SourceCount is to update each version 
    var SourceCount = 1;
    // Adding the Source and Layer for all version routes 
    for(let j = 0; j < flightroutesCopy.length; j++)
    {
        // Used to increment the value of the point measurement against the route.
        // Add a source and layer displaying a point which will be animated in a circle.
        map.addSource( 'route' + SourceCount, {
            'type': 'geojson',
            'data': window['route' + SourceCount]
        });

        map.addSource( 'point' + SourceCount, {
            'type': 'geojson',
            'data': window['point' + SourceCount]
        });

        map.addLayer({
            'id': 'route' + SourceCount,
            'source': 'route' + SourceCount,
            'type': 'line',
            'paint': {
                'line-width': 2,
                'line-color': '#007cbf'
            }
        });

        map.addLayer({
            'id': 'point' + SourceCount,
            'source': 'point' + SourceCount,
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

        // Move on to the next version
        SourceCount++;
    }

    // Initialize distance steps in the routes
    var DistSteps = 500;
    // Initalize the version for the route
    var version = 1;
    // Function for performing the animation on the map
    function animate() {

        // Define where it starts and ends
        var start =
            window['route' + version].features[0].geometry.coordinates[
                window['counter' + version] >= DistSteps ?  window['counter' + version] - 1 :  window['counter' + version]
            ];

        var end =
            window['route' + version].features[0].geometry.coordinates[
                window['counter' + version] >= DistSteps ? window['counter' + version] : window['counter' + version] + 1
            ];

        // Enter the statement if only if one of start or end turns to be false
        // General Case: when the plane lands on the airport 
        
        if (! start || ! end) {
            // updating the version 
            version++;
            // True only if there's no such route version 
            if(version > flightroutesCopy.length){
                // exit the animate 
                return;
            }
            // redefine the start 
            var start =
                window['route' + version].features[0].geometry.coordinates[
                    window['counter' + version] >= DistSteps ?  window['counter' + version] - 1 :  window['counter' + version]
                ];
            // redefine the end
            var end =
                window['route' + version].features[0].geometry.coordinates[
                    window['counter' + version] >= DistSteps ? window['counter' + version] : window['counter' + version] + 1
                ];
            // Recurively enter the animate for the next version
            animate(window['counter' + version]);

        }

        // Update point geometry to a new position based on counter denoting
        // the index to access the arc
        window['point' + version].features[0].geometry.coordinates = 
            window['route' + version].features[0].geometry.coordinates[window['counter' + version]];

        // Calculate the bearing to ensure the icon is rotated to match the route arc
        // The bearing is calculated between the current point and the next point, except
        // at the end of the arc, which uses the previous point and the current point
        window['point' + version].features[0].properties.bearing = turf.bearing(
            turf.point(start),
            turf.point(end)
        );
        
        // Update the source with this new data
        map.getSource('point' + version).setData(window['point' + version]);

        // Request the next frame of animation as long as the end has not been reached
        if (window['counter' + version] < DistSteps) {    
            requestAnimationFrame(animate);
        }
        
        window['counter' + version] =  window['counter' + version] + 1;
    }

    // DOM Buttons that links to the 'flight' button in the index.ejs 
    document.getElementById('FlightButton').addEventListener('click', function () {
        animate(counter1);
    })
});