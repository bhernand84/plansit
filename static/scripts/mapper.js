var map;
var mapOptions;
var browserSupportFlag;
var infowindow;
var markers = [];
var mySavedPlaces = [];
var toggleSavedPlaces = true;

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
    var searchBox = new google.maps.places.SearchBox((input));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    setTimeout(AddMapListeners(input, searchBox), 1);  
    map.setZoom(15);
}

function AddMapListeners(input, searchBox, types){
    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }
        for (var i = 0, marker; marker = markers[i]; i++) {
            marker.setMap(null);
        }

        ClearMarkers();
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
            CreateMarker(place);            
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

function LoadSavedPlaces(myPlaces){
    var isSavedBool = true;
    if(myPlaces.length != 0){
        for(var i = 0, savedPlace; savedPlace = myPlaces[i]; i++){
            //get details from each place based of the place_id given.
            var service = new google.maps.places.PlacesService(map);
            request = {
                placeId: savedPlace,
            };
            service.getDetails(request, function (place, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    CreateMarker(place, isSavedBool);
                }
            });            
        }
    }
}

function IsAlreadySaved(place){
    //savedPlaces is a collection of objects, not id's
    var savedPlacesIDs = [];
    for(var i = 0; i < mySavedPlaces.length; i++){
        savedPlacesIDs.push(mySavedPlaces[i].place_id);
    }

    if(savedPlacesIDs.indexOf(place.place_id)!= -1){
        place.isSaved = true;
        console.log("already saved");
    }
    else{
        place.isSaved = false;
    }
}

function CreateMarker(placeResult, isSavedBool) {
    var placeLoc = placeResult.geometry.location;
    var image = {
            url: placeResult.icon,
            size: new google.maps.Size(45, 45),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };
    
    var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: placeResult.name,
        place: {
            placeId: placeResult.place_id,
            location: placeLoc
        },
        isSaved: IsAlreadySaved(placeResult)
    });

    if(isSavedBool!=null){
        marker.isSaved = true;
    };

    google.maps.event.addListener(marker, 'click', function () {
        GetPlaceDetails(marker);
    });
    if(marker.isSaved){
        mySavedPlaces.push(marker);
    }
    else if(!marker.isSaved){
    markers.push(marker);
    };
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

function SearchNearby() {
    ClearMarkers();
    var myMap = map.getCenter();

    request = {
        location: myMap,
        radius: 500,
        types: ['bar']
    };

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, Callback)
}

function GetPlaceDetails(marker) {
    if (infowindow) {
        infowindow.close();
    };
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    request = {
        placeId: marker.place.placeId
    };

    service.getDetails(request, function (place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            OpenInfoWindow(place, marker);
        }
    });
}

function OpenInfoWindow(place, marker) {
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
    '</div>' +
    '</div>';

    infowindow.setContent(contentString);
    infowindow.open(map, marker);

    if (photo) {
        $('#bodyContent').append('<p class="images">' + '<img src=' + photo + ' alt="photo">' + '</p>');
    }
    if (rating) {
        $('#bodyContent').append('<p class="rating">Rating: ' + rating + '</p>');
    }
    if (phone) {
        $('#bodyContent').append('<p class="phone">Phone: ' + phone + '</p>');
    }
}

function ClearMarkers() {
    for (var i = 0; i < markers.length; i++ ) {
        //add if statement to keep markers with isSaved bool = true on the map

        if(markers[i].isSaved){
            savedPlaces.push(markers[i]);
        }
        markers[i].setMap(null);
    }
        markers.length = 0;
}

function Callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < results.length; ++i) {
            bounds.extend(results[i].geometry.location);
            var place = results[i];
            CreateMarker(results[i]);
        }
        map.fitBounds(bounds);
    }
}

function ToggleSavedMarkers() {
    //false = hide     true = show
    if (toggleSavedPlaces == false) {
        HideSavedMarkers();
        toggleSavedPlaces = true;
    } else {
        ShowSavedMarkers();
        toggleSavedPlaces = false;
    }

    // Sets the map on all markers in the array.
    function SetAllMap(map) {
        for (var i = 0; i < mySavedPlaces.length; i++) {
            mySavedPlaces[i].setMap(map);
        }
    }

    // Removes the markers from the map, but keeps them in the array.
    function HideSavedMarkers() {
        SetAllMap(null);
    }

    // Shows any markers currently in the array.
    function ShowSavedMarkers() {
        SetAllMap(map);
    }
}



window.onload = LoadScript;
