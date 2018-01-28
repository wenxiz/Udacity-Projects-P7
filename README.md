# Neighborhood Map Project

This is a single page application which contains a certain area information. This app is to demonstrate the ability to use js framework (`knockout.js`) & Google Maps API and to request data from API. The application was made as a the penultimate final project for Udacity's Front-End Nanodegree.

## Freatures

Using google maps API to implement great restaurants abournd DC Metro Area. The site is fully responsive and can run in different devices like Pad and mobile. You get a full screen Google Map, populated with my favorite locations, along with a sidebar with a list of the locations that can be clicked on and also filtered so you can nail down what you want without any other distractions. You can also get panorama even inside view of restaurants and of course average price as reference.

## APIs

Google Maps API is used to show the map and generate the markers etc. Yelp API is used to pull more infomation of restaurants.

## Contents

CSS - Two files to render the app main interface. 

- `bootsnipp-admin-side-menu.css` - Use Bootstrap to render the main style of the page.
- `style.css` - Overwrite Bootstrap CSS for custom styling of app

JS - Three files to implement function of the app.

- `starting-location.js` - Initial area information of certain area. 
- `app.js` - Main application file.
- `knockout.js` - Framework to implement dynamic binding of data.

HTML - `index.html` - UI of the app.

bower_components and `bower.json` - Package control system to make sure the latest library and framework.

## Installation

Clone or download this repo and simply open the index.html file and enjoy! You can make modifications to the locations and add your own in the `js/starting-location.js` file.



