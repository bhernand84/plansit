var map;
var mapOptions;
var browserSupportFlag;
var infowindow;
var markers = [];

function Initialize() {
    mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(50.9500, -70.1667),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    AttemptGeolocation();

    var input = (document.getElementById('pac-input'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    var searchBox = new google.maps.places.SearchBox((input));

    setTimeout(AddMapListeners(input, searchBox), 1);  
    map.setZoom(15);

    
}

function AddMapListeners(input, searchBox){
    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }
        for (var i = 0, marker; marker = markers[i]; i++) {
            marker.setMap(null);
        }

        markers = [];
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
            CreateMarker(places[i]);            
            console.log('markers pushed');
            bounds.extend(place.geometry.location);
        }

        map.fitBounds(bounds);
    });

    // Bias the SearchBox results towards places that are within the bounds of the
    // current map's viewport.
    google.maps.event.addListener(map, 'bounds_changed', function() {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
    });
}

function CreateMarker(place) {
    var placeLoc = place.geometry.location;
    var image = {
                url: place.icon,
                size: new google.maps.Size(45, 45),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
    var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location,
        placeId: place.place_id
    });
    google.maps.event.addListener(marker, 'click', function () {
        getPlaceDetails(marker);
    });

    markers.push(marker);
}

function HandleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
        alert("Geolocation service failed.");
        map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
    } else {
        alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
        map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
    }
    map.setCenter();
}

function LoadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?signed_in=true&libraries=places&callback=Initialize';

    document.body.appendChild(script);
    console.log('scripts loaded');
}

function AttemptGeolocation() {
    if (navigator.geolocation) {
        console.log("geolocation is true");
        navigator.geolocation.getCurrentPosition(function (position) {
            var center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(center);

            console.log(map.center);

            var windowContent = '<div>Current Location</div>';

            var marker = new google.maps.Marker({
                map: map,
                position: center,
                title: 'Current Location',
            });

            var infowindow = new google.maps.InfoWindow({
                content: windowContent
            });

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, marker);
            });

        }, function () {
            HandleNoGeolocation(browserSupportFlag);
        });
    }
    else {
        console.log("geolocation is false");
        HandleNoGeolocation(browserSupportFlag);
    }
}

function searchNearby() {
    var myMap = map.getCenter();

    request = {
        location: myMap,
        radius: 500,
        types: ['bar']
    };

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback)
}

function getPlaceDetails(marker) {
    if (infowindow) {
        infowindow.close();
    };
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    request = {
        placeId: marker.placeId
    };

    service.getDetails(request, function (place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            openInfoWindow(place);
        }
    });

    function openInfoWindow(place) {
        google.maps.event.addListener(marker, 'click', function () {
            if (infowindow) {
                console.log('found a window!');
                infowindow.close();
            }
        });
        google.maps.event.addListener(map, 'click', function () {
            if (infowindow) {
                console.log('found a window!');
                infowindow.close();
            }
        });
        var phone = (place.formatted_phone_number == null) ? null : place.formatted_phone_number;
        var photo = (place.photos == null) ? null : place.photos[0].getUrl({ "maxWidth": 80, "maxHeight": 80 });
        var rating = (place.rating == null) ? null : place.rating;
        var contentString = '<div class="detailWindow">' +
       '<div id="siteNotice">' +
       '</div>' +
       '<h3 id="firstHeading" class="firstHeading">' + place.name + '</h3>' +
       '<div id="bodyContent">' +
       '<h5 class="address">' + place.formatted_address + '</h5>' +
       '<p class="phone">Phone: ' + phone + '</p>' +
       '<p class="rating">Rating: ' + rating + '</p>' +
       '<p class="images">' + '<img src=' + photo + ' alt="photo">' + '</p>'
        '</div>' +
        '</div>';

        infowindow.setContent(contentString);
        infowindow.open(map, marker);

        if (!photo) {
            $('.images').hide();
        }
        if (!rating) {
            $('.rating').hide();
        }
        if (!phone) {
            $('.phone').hide();
        }
    }
}

function ClearMarkers() {
    for (var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }
        markers.length = 0;
    };

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < results.length; ++i) {
            bounds.extend(results[i].geometry.location);
            var place = results[i];
            CreateMarker(results[i]);
        }
        map.fitBounds(bounds);
    }
};


window.onload = LoadScript;
