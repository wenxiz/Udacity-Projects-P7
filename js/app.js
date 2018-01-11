var map = {};
var marker = {};
var infoWindow = {}

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
    map = new google.maps.Map(document.getElementById('map'),
    {
    center: {lat: 38.8993941, lng: -77.0468078},
    zoom: 14
    });
    // Create a searchbox to excute a places search
    var searchBox = new google.maps.places.SearchBox(
        document.getElementById('places-search'))
    // Bias the searchbox to within the bounds of map.
    searchBox.setBounds(map.getBounds());

    // Listen for the event fired when the user selects a prediction and clicks
    // "go" more details for that place.
    document.getElementById('go-places').addEventListener('click', textSearchPlaces);

    // This function firest when the user selecet "√" on the places search.
    // It will do a nearby search using the entered query string or place.
}

var Neiborhoods = function(data) {
    this.neighborhoods = ko.observableArray(data.neighborhood);

}

var Restaurants = function(data) {
    this.titles = ko.observableArray(data.title);
}

var ViewModel = function() {
    var self = this;
    // Put neighborhood data under neighborhoodList
    this.neighborhoodList = ko.observableArray([]);
    neighborObjArray.forEach(function(neighborhoodItem) {
        self.neighborhoodList.push(neighborhoodItem);
    });

    this.currentNeighborhoods = ko.observable(this.neighborhoodList()[0]);

    // Put restaurants data under restaurantsList
    this.restaurantsList = ko.observableArray([]);
    neighborObjArray.forEach(function(neighborhoodItem) {
        self.restaurantsList.push(neighborhoodItem);
    });
   }

// Apply bindings to ViewModel
ko.applyBindings(new ViewModel());






