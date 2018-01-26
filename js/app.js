var map = {};
// Create a new blank array for all the listing markers.
var markers = [];
var infoWindow = {};

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

var filterText = ko.observable("");

var Place = function(data) {
    var self = this;
    this.title = data.title;
    this.position = data.location;
    this.visible = ko.computed(function() {
        var placeName = self.title.toLowerCase();
        var re = filterText().toLowerCase();
        return (placeName.indexOf(re) != -1)
    })
}

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

//     // Create infoWindow to show details on each restaurant
//     var largeInfowindow = new google.maps.InfoWindow();
//     var bounds = new google.maps.LatLngBounds();

//     // // The following groups use neighborObjArray to creat an array of markers on initialize.
//     for (var i = 0; i < neighborObjArray.length; i++) {
//         // Get the position from neighborObjArray array
//         var position = neighborObjArray[i].location;
//         var title = neighborObjArray[i].title;
//         var id = neighborObjArray[i].id;
//         // Create marker per location and put into markers array
//         var marker = new google.maps.Marker({
//             map: map,
//             position: position,
//             title: title,
//             animation: google.maps.Animation.DROP,
//             id: id
//         });
//         // Push marker into markers array
//         markers.push(marker);


//         // Create onclick events to open an infoWindow at each marker and add animation on each marker
//         marker.addListener('click', function(){
//             populateInfoWindow(this, largeInfowindow);
//             toggleBounce();
//         });
//         // Extends the boundaries for each markers
//         bounds.extend(markers[i].position);
//     }
   
//     map.fitBounds(bounds);

//     // This function add animation on markers when click on markers
//     function toggleBounce() {
//         if (marker.getAnimation() !== null) {
//           marker.setAnimation(null);
//         } else {
//           marker.setAnimation(google.maps.Animation.BOUNCE);

//         }
//     }
//     // This function pupulates the infoWindow when the marker is clicked.
//     function populateInfoWindow(marker, infowindow) {
//         // Check to make sure the infoWindow is not already opened on this marker.
//         if (infowindow.marker != marker) {
//             // infowindow.setContent('<div>' + marker.title + '</div>');
//             infowindow.marker = marker;
//         // Make sure the marker property is cleared if the window is closed.
//             infowindow.addListener('closeclick', function() {
//                 infowindow.setMarker = null;
//             });
//         // Add street view service in infowindow
//         var streetViewService = new google.maps.StreetViewService();
//         // Set radius to 50 meters in case there is no street view of our specific latLng
//         var radius = 50;
//         // If the case of status is OK, which means the pano was found, compute the position of the streetview image, then
//         // get a panorama from that and set the options
//         function getStreetView(data, status) {
//             if (status == google.maps.StreetViewStatus.OK) {
//                 var nearStreetViewLocation = data.location.latLng;
//                 var heading = google.maps.geometry.spherical.computeHeading(
//                     nearStreetViewLocation, marker.position);
//                     infowindow.setContent('<div>' + marker.title + '</div><div id="pano">123</div>');
//                     var panoramaOptions = {
//                         position: nearStreetViewLocation,
//                         pov: {
//                             heading: heading,
//                             pitch: 30
//                         }
//                     };
//                 var panorama = new google.maps.StreetViewPanorama(
//                     document.getElementById('pano'), panoramaOptions);
//             } else {
//                 infowindow.setContent('<div>' + marker.title + '</div>' +
//                    '<div>No Street View Found</div>');
//             }
//         }
//     // Use street view service to get cloest street view images within 50 meters of marker's position
//     streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
//     infowindow.open(map, marker);
//             // console.log(markers.length);
//         }
//     }
}

// var Marker = function(markerItem) {
//     this.title = ko.observable(markerItem.title);
//     this.position = ko.observable(markerItem.location)
// };

var ViewModel = function() {
    var self = this;

    this.placesList = [];
    neighborObjArray.forEach(function(data) {
        self.placesList.push(new Place(data))
    });

    this.filteredList = ko.computed(function() {
        var result = [];
        self.placesList.forEach(function(place) {
            if (place.visible()) {
                result.push(place);
            }else{
            }
        });
        return result;
    })
}


   //  // Put neighborhood data under neighborhoodList
   //  var neighborhoods = neighborObjArray.reduce(function(acc, curr){
   //      return [...acc, curr.neighborhood];
   //  }, []);
   //  // Get distinct neighborhood value from neighborObjArray
   //  this.neighborhoodList = ko.observableArray(
   //      ko.utils.arrayGetDistinctValues(neighborhoods));

   //  // Put restaurants data under restaurantsList
   //  this.restaurantsList = ko.observableArray([]);
   //  neighborObjArray.forEach(function(neighborhoodItem) {
   //      self.restaurantsList.push(neighborhoodItem);
   //  });
   // }

// Apply bindings to ViewModel
ko.applyBindings(new ViewModel());







