mapboxgl.accessToken = 'pk.eyJ1Ijoic3BvcnR5amFtZXMiLCJhIjoiY2twaHQxd3p6MDI0YjJwczFqYWd1MW83eSJ9.Ec5CD2tM6R-F812BnoCYvA';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center: [-96, 37.8],
zoom: 3
});



let count = 1;
for(let j = 0; j < flightroutesCopy.length; j++){
    
    let oriGeo = flightroutesCopy[j].oriGeometry.coordinates;
    let desGeo = flightroutesCopy[j].desGeometry.coordinates; 

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


    window['arc' + count] = [];

    window['lineDistance' + count] = turf.length(window['route' + count].features[0]);

    window['arc' + count] = [];

    // Number of steps to use in the arc and animation, more steps means
    // a smoother arc and animation, but too many steps will result in a
    // low frame rate

    let steps = 1000;
    // Draw an arc between the `origin` & `destination` of the two points
    for (var i = 0; i < window['lineDistance' + count]; i += window['lineDistance' + count] / steps) {
        var segment = turf.along(window['route' + count].features[0], i);
        window['arc' + count].push(segment.geometry.coordinates);
    }

    // Update the route with calculated arc coordinates
    window['route' + count].features[0].geometry.coordinates = window['arc' + count];

    count++;
}
   
    

    map.on('load', function () {
        
        let count = 1;
        for(let j = 0; j < flightroutesCopy.length; j++)
        {
            // Used to increment the value of the point measurement against the route.
            window['counter' + count] = 0;
            // Add a source and layer displaying a point which will be animated in a circle.
            map.addSource( 'route' + count + '', {
                'type': 'geojson',
                'data': window['route' + count]
            });

            map.addSource( 'point' + count + '', {
                'type': 'geojson',
                'data': window['point' + count]
            });

            map.addLayer({
                'id': 'route' + count + '',
                'source': 'route' + count + '',
                'type': 'line',
                'paint': {
                    'line-width': 2,
                    'line-color': '#007cbf'
                }
            });

            map.addLayer({
                'id': 'point' + count + '',
                'source': 'point' + count + '',
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
            count++;
        }
       
 
        // count = 1
        function animate() {
            count = 1;
            let steps = 500;
            for(let j = 0; j < flightroutesCopy.length; j++)
            {
                window['start' + count]=
                    window['route' + count].features[0].geometry.coordinates[
                        window['counter' + count] >= steps ? window['counter' + count] - 1 : window['counter' + count]
                    ];
                window['end' + count] =
                    window['route' + count].features[0].geometry.coordinates[
                        window['counter' + count] >= steps ? window['counter' + count] : window['counter' + count] + 1
                    ];
                if (! window['start' + count] || !window['end' + count]) return;
        
                // Update point geometry to a new position based on counter denoting
                // the index to access the arc
                window['point' + count].features[0].geometry.coordinates =
                    window['route' + count].features[0].geometry.coordinates[window['counter' + count]];
        
                // Calculate the bearing to ensure the icon is rotated to match the route arc
                // The bearing is calculated between the current point and the next point, except
                // at the end of the arc, which uses the previous point and the current point
                window['point' + count].features[0].properties.bearing = turf.bearing(
                    turf.point(window['start' + count]),
                    turf.point(window['end' + count])
                );
                
                // Update the source with this new data
                map.getSource('point' + count + '').setData(window['point' + count]);
        
                // Request the next frame of animation as long as the end has not been reached
                if (window['counter' + count] < steps) {
                    requestAnimationFrame(animate);
                }
        
                window['counter' + count]++;
                count++;
            }

        }

        animate( counter1 );

        
    });

   

