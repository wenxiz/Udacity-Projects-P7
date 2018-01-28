var map = {};
// Create a new blank array for all the listing markers.
var markers = [];
var infoWindow = {};
var apiURL = "https://api.yelp.com/v3/businesses/search"

// The orignal js is from: https://bootsnipp.com/snippets/featured/admin-side-menu
// Use this snippets to complement function on side menu
$(function () {
    $('.navbar-toggle').click(function () {
        $('.navbar-nav').toggleClass('slide-in');
        $('.side-body').toggleClass('body-slide-in');
        $('#search').removeClass('in').addClass('collapse').slideUp(200);

        /// uncomment code for absolute positioning tweek see top comment in css
        //$('.absolute-wrapper').toggleClass('slide-in');
    });
   // Remove menu for searching
   $('#search-trigger').click(function () {
        $('.navbar-nav').removeClass('slide-in');
        $('.side-body').removeClass('body-slide-in');

        /// uncomment code for absolute positioning tweek see top comment in css
        //$('.absolute-wrapper').removeClass('slide-in');

    });
});

// var filterText = ko.observable("");



// Google Maps API
// Create a map object and specify the DOM element for display
function initMap() {
    // Creates a new map
    map = new google.maps.Map(document.getElementById('map'),
    {
    center: {lat: 38.8878878, lng: -77.0565289},
    zoom: 13,
    // styles: styles
    });

    // Apply bindings to ViewModel
    ko.applyBindings(new ViewModel());

    // // The following groups use neighborObjArray to creat an array of markers on initialize.
    // for (var i = 0; i < neighborObjArray.length; i++) {
    //     // Get the position from neighborObjArray array
    //     var position = neighborObjArray[i].location;
    //     var title = neighborObjArray[i].title;
    //     var id = neighborObjArray[i].id;
    //     // Create marker per location and put into markers array
    //     var marker = new google.maps.Marker({
    //         map: map,
    //         position: position,
    //         title: title,
    //         animation: google.maps.Animation.DROP,
    //         id: id
    //     });
    //     // Push marker into markers array
    //     markers.push(marker);


    //     // Create onclick events to open an infoWindow at each marker and add animation on each marker
    //     marker.addListener('click', function(){
    //         populateInfoWindow(this, largeInfowindow);
    //         
    //     });
    //     // Extends the boundaries for each markers
    //     bounds.extend(markers[i].position);
    // }
    // map.fitBounds(bounds);

    
    // This function pupulates the infoWindow when the marker is clicked.
    
    
}

var Marker = function(markerItem) {
    this.title = ko.observable(markerItem.title);
    this.position = ko.observable(markerItem.location)
};

var Place = function(data) {
    this.title = ko.observable(data.title);
}

var ViewModel = function() {
    var self = this;

    self.placesList = ko.observableArray([]);
    self.searchInput = ko.observable('');

    neighborObjArray.forEach(function(data) {
        var place = new Place(data);
        // Marker information
        var marker = new google.maps.Marker({
            position: data.location,
            map: map,
            title: data.title,
            animation: google.maps.Animation.DROP
        });

        // Pushes marker to markers array
        place.marker = marker;
        self.placesList.push(place)
        // Marker and infowindow event listener
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
            toggleBounce();
        });
        // This function add animation on markers when click on markers
        function toggleBounce() {
            if (marker.getAnimation() !== null) {
              marker.setAnimation(null);
            } else {
              marker.setAnimation(google.maps.Animation.BOUNCE);
              setTimeout(function(){
                marker.setAnimation(null);
            }, 2000);
            }
        }

    self.filteredList = ko.computed(function() {
        return ko.utils.arrayFilter(self.placesList(), function(place){
            if(place.title().toLowerCase().indexOf(self.searchInput().toLowerCase()) >= 0) {
                place.marker.setVisible(true);
                return true;
            }else{
                place.marker.setVisible(false);
                return false;
            }
        })
    })

    self.placeClicked = function(place) {
        google.maps.event.trigger(place.marker, 'click');
    };

    // Create infoWindow to show details on each restaurant
    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infoWindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            // infowindow.setContent('<div>' + marker.title + '</div>');
            infowindow.marker = marker;
        // Make sure the marker property is cleared if the window is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.setMarker = null;
            });
        // Add street view service in infowindow
        var streetViewService = new google.maps.StreetViewService();
        // Set radius to 50 meters in case there is no street view of our specific latLng
        var radius = 50;
        // If the case of status is OK, which means the pano was found, compute the position of the streetview image, then
        // get a panorama from that and set the options
        function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marker.position);
                    infowindow.setContent('<div style="font-size: 18px; color: #051487;">' + marker.title + '</div><div id="pano">123</div>');
                    var panoramaOptions = {
                        position: nearStreetViewLocation,
                        pov: {
                            heading: heading,
                            pitch: 30
                        }
                    };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent('<div>' + marker.title + '</div>' +
                   '<div>No Street View Found</div>');
            }
        }

        // Request data with AJAX
        $.ajax({
            url: apiURL + marker.title,
            dataType: 'json',
            timeOut: 5000
        })
        .done(function(data) {
            infowindow.setContent(data.businesses[0].price);
            infowindow.open(map, marker);
        })
        .fail(function() {
            console.log("error");
        });   
    });
        // Use street view service to get cloest street view images within 50 meters of marker's position
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        infowindow.open(map, marker);
            // console.log(markers.length);
        }
    }
}









