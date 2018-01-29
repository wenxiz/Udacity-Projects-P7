var map = {};
// Create a new blank array for all the listing markers.
var markers = [];
var infoWindow = {};
// Foursquare API Client
var foursquareUrl = "https://api.foursquare.com/v2/venues/";
var clientID = '&client_id=PPJCMNGT53VGKCOI3L5XF4LQUZKEAMHBOC3VXQOT5IPT3V3R';
    clientSecret = '&client_secret=0ZF4N3S3MYQIKTIWT1TW3OZVPYKJTWJDGXXT3R3FK5N1BVK0';

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
        var api_url = foursquareUrl + data.id + '/tips?' + clientID + clientSecret + '&v=20180128';

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
        // Request data with AJAX
        var data = $.ajax({
            url: api_url,
            data: {format: 'json'},
            dataType: 'json',
            timeOut: 20
        })
        .fail(function() {
            alert("Oops! Failed to load api");
        });   

        // Marker and infowindow event listener
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow, data);
            toggleBounce();
        });
    });


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
    function populateInfoWindow(marker, infowindow, data) {
        // Pull tips text from Foursquare API
        var text = data.responseJSON.response.tips.items[0].text;
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
                    infowindow.setContent('<div style="font-size: 18px; color: #051487;">' + marker.title + '</div><div id="pano"></div>' + '<div id="tips">' + text + '</div>');
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
        // Use street view service to get cloest street view images within 50 meters of marker's position
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        infowindow.open(map, marker);
        }
    }
}

// Fail to load google map
function googleError() {
     alert("Oops! Failed to load google map!");
}









