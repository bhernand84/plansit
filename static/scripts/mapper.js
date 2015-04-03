var plansitDb;
var mySavedMarkers = [];
var mySavedPlaces= [];
var myTripId;

require(['async!https://maps.googleapis.com/maps/api/js?signed_in=true&libraries=places',
    "jquery-ui/jquery-ui",
    "plansitDb",
    ], function(maps, ui, plansitDB){
    Initialize();
    plansitDb = plansitDB;
    myTripId = getRequestParameter("tripid");

    var Trips = plansitDb.GetTrip(myTripId, LoadTrip);    
    plansitDb.GetUserData();
});
function LoadTrip(trips){
if(trips){
    if(trips.places){
        mySavedPlaces = trips.places;
    }
    $("#tripHeader").html(trips.name);
        LoadSavedPlaces();
    }
}

function LoadSavedPlaces(){
    if(mySavedPlaces.length != 0){
        var bounds = new google.maps.LatLngBounds();
        for(var i = 0, savedPlace; savedPlace = mySavedPlaces[i]; i++){
            var service = new google.maps.places.PlacesService(map);
            request = {
                placeId: savedPlace.placeid
            };

            service.getDetails(request, function (place, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    place.isSaved = true;
                    var newMarker = CreateMarker(place, true);
                    bounds.extend(place.geometry.location);
                    map.fitBounds(bounds);
                }
            });            
        }
        map.setCenter(bounds.getCenter());
        ToggleSavedMarkers();
    }  
}

var map;
function Initialize() {
    mapOptions = getMapOptions();
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    addSearchBoxToMap();
    AddPlaceResultListeners();
}
function getMapOptions () {
    return {
        zoom: 14,
        center: new google.maps.LatLng(50.9500, -70.1667),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
}
function addSearchBoxToMap(){
    var input = (document.getElementById('pac-input'));
    var searchBox = new google.maps.places.SearchBox((input));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var autocomplete = new google.maps.places.Autocomplete(input);
    place = autocomplete.getPlace();
    autocomplete.bindTo('bounds', map);
    AddMapListeners(input, searchBox);
}
function AddPlaceResultListeners(){
    $("#places, #savedPlaces").on("click", ".placeLink", function(e){
        e.preventDefault();
        var savedPlaceId = $(this).attr("data-placeid");
        var savedPlace = $(this).attr("data-saved") == 'true';
        if(savedPlace){
            var savedMarker = $.grep(mySavedMarkers, function(e){ 
                return e.place.placeId == savedPlaceId;
            });
            GetPlaceDetails(savedMarker[0]);
        }   
        else {
            var mapMarker = $.grep(markers, function(e){ 
                return e.place.placeId == savedPlaceId;

            });
            GetPlaceDetails(mapMarker[0]);
        }
    });
    $("#places, #savedPlaces").on("click", ".deletePlace", function(e){
        e.preventDefault();
        if(confirm('you sure girl?')){
            var savedPlaceId = $(this).attr("data-placeid");
            var savedPlace = $(this).attr("data-saved") == 'true';
            if(savedPlace){
                var savedMarker = $.grep(mySavedMarkers, function(e){ 
                    return e.place.placeId == savedPlaceId;
                });
                var savedIndex = mySavedMarkers.indexOf(savedMarker[0]);
                mySavedMarkers[savedIndex].setMap(null);

                var savedPlaceDB = $.grep(mySavedPlaces, function(e){ 
                    return e.placeid == savedPlaceId;
                });
                $("[data-placeid='" + savedPlaceId + "']").remove();

                   var savedPlaceDB = $.grep(mySavedPlaces, function(e){ 

                    return e.placeid == savedPlaceId;
                });
                var placeindex = mySavedPlaces.indexOf(savedPlaceDB[0]);
                if(placeindex > -1){
                    delete mySavedMarkers[placeIndex];
                }
                plansitDb.RemovePlace(myTripId, savedPlaceDB[0].id);
            }
     }
    });
 }  
function AddMapListeners(input, searchBox, types){
    toggleSavedPlaces = true;
    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();
        DisplayPlaces(places);
    });
    google.maps.event.addListener(map, 'bounds_changed', function() {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
    });
}
function DisplayPlaces(places){
     if (places.length == 0) {
            return;
        }
        ClearPlaceListings();
        ClearMarkers();
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
            CreateMarker(place);            
            bounds.extend(place.geometry.location);
        }
        map.fitBounds(bounds);
}

function ClearPlaceListings(){
    $("#places div").remove()
}
function ClearMarkers() {
    for (var i = 0; i < markers.length; i++ ) {
        if(markers[i].isSaved==false){
        markers[i].setMap(null);
        }
    }
        markers.length = 0;
}
function CreateMarker(placeResult) {
    var image =  getMarkerImage(placeResult.icon);

    isSavedBool = IsAlreadySaved(placeResult);

    var placeLoc = placeResult.geometry.location;

    var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: placeResult.name,
        place: {
            placeId: placeResult.place_id,
            location: placeLoc
        },
        isSaved: isSavedBool
    });

    AddMarkerToCollection(marker)   

    google.maps.event.addListener(marker, 'click', function () {
        GetPlaceDetails(marker);
    });
       
    return marker;
}

function IsAlreadySaved(place){
   if(place.isSaved){
        return true;
   }
   if(mySavedMarkers.length==0){
        return false;
    }
    else {
        for(var i = 0, savedMarker= mySavedMarkers[i]; i < mySavedMarkers.length; i++){
            if(savedMarker.place.place_id = place.place_id){
                return true;
            }
        }  
            
        return false;
            
    }
}

function getMarkerImage(icon){
    return {
            url: icon,
            size: new google.maps.Size(45, 45),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };
}
var browserSupportFlag;
var infowindow;
var markers = [];
var toggleSavedPlaces = true;
var categories = ["Breakfast", "Brunch", "Lunch", "Dinner", "Happy Hour", "Dancing", "Live Music", "Historic", "Park"];



function GetMarkersFromSaved(places){
    $.each(places, function(place){
        mySavedMarkers.push({
            placeid: place.placeId, 
            notes: place.notes, 
            categories: place.categories
        });
    });
}







function AddMarkerToCollection(marker){
     if(marker.isSaved){
        AddMarkerToSavedPlaces(marker);
    } else {
        markers.push(marker);
    }
    CreatePlaceListing(marker);
}
function CreatePlaceListing(marker){
    if(marker.isSaved){
        $("#savedPlaces").append("<div data-placeid='" + marker.place.placeId + "'><p><a class='placeLink' data-saved='true' data-placeid="+ marker.place.placeId + "> " + marker.title + "</a><span class='right'><a class='deletePlace' data-saved='true' data-placeid="+ marker.place.placeId + ">X</a></span></p>"); 
    }
    else{
        $("#places").append("<div><p><a class='placeLink' data-placeid="+ marker.place.placeId + "> " + marker.title + "</a></p>");
    }
}
function AddMarkerToSavedPlaces(placeMarker){
    mySavedMarkers.push(placeMarker);
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

function AttemptGeolocation() {
    if (navigator.geolocation) {
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
            place.isSaved = IsAlreadySaved(place);
            OpenInfoWindow(place, marker);
        }
    });
}

function OpenInfoWindow(place, marker) {
    google.maps.event.addListener(marker, 'click', function () {
        if (infowindow) {
            infowindow.close();
        }
    });
    google.maps.event.addListener(map, 'click', function () {
        if (infowindow) {
            infowindow.close();
        }
    });
    var isSaved = place.isSaved;
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
    if (!isSaved) {
        $('#bodyContent').append('<button id="savePlace">Save To My Map</button>');
        
        $('#savePlace').click(function(){
        
                infowindow.close();
                var categoryList = CreateCategoryList();
                var modalText = $('<form id="dialog" title="'+place.name+'">' +
                                    '<div>' +
                                        '<textarea id="myNotes" rows="3" name="notes" cols="27" placeholder="Save your notes here..."></textarea>' +
                                    '</div>' +
                                    categoryList.html() + '<input type="submit" value="Submit">' +
                                '</form>');
                modalText.dialog();

                modalText.submit(function(event){
                    event.preventDefault();
                    var myNotes = document.getElementById("myNotes").value;
                    var categories =  [];
                    $("input[name='categories']:checked").each(function() {
                      categories.push($(this).val());
                    });
                    place.categories = categories;
                    place.notes = myNotes;
                    place.isSaved = true;
                    arrayForPlace = [];
                    listOfCheckedBoxes = null;
                    myNotes = null;

                    SavePlace(place);
                    modalText.dialog('destroy').remove();
                });
        });
    }
}

function SavePlace(place){

    DeleteMarkerByPlaceId(place);
    
    var newPlaceId = place.place_id;
    var newNotes = place.notes;
    var newCategory = place.categories;

    plansitDb.AddPlace(myTripId, newPlaceId, newNotes, newCategory);
    var newMarker = CreateMarker(place);
    newMarker = AddMarkerToSavedPlaces(newMarker);
 
}

function CreateCategoryList(){
    var listForHtml = $('<ul type="none" id="listOfCategories"></ul>')
    if(categories.length!=0){
        for(var i = 0; i < categories.length; i++){
            var listItem = '<li>' + '<input type="checkbox" name="categories" value="'+categories[i]+'">' + categories[i] + '</li>';
            listForHtml.append(listItem);
        }
        return listForHtml;
    };   
}


function Callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        DisplayPlaces(results);
    }
}

function ToggleSavedMarkers() {
    if (toggleSavedPlaces == false) {
        HideSavedMarkers();
        toggleSavedPlaces = true;
    } else {
        ShowSavedMarkers();
        toggleSavedPlaces = false;
    }

    function SetAllMap(map) {
        for (var i = 0; i < mySavedMarkers.length; i++) {
            mySavedMarkers[i].setMap(map);
        }
    }

    function HideSavedMarkers() {
        SetAllMap(null);
    }

    function ShowSavedMarkers() {
        SetAllMap(map);
    }
}

function DeleteMarkerByPlaceId(place){
    for(var i = 0; i < markers.length; i++){
        var placeId = markers[i].place.placeId;
        if(placeId==place.place_id){
            markers[i].setMap(null);
        }
    }
}

function checkRefParam() {
        var paramValue = getRequestParameter('ref');
        if (paramValue) {
            writeCookie('ref', paramValue);
    }
}
function getRequestParameter(name) {
    name = name.toLowerCase();
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search.toLowerCase()))
        return decodeURIComponent(name[1]);
}

