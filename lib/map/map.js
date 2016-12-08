/* jshint esversion:6 */

/*
This file contains all logic related to Google Map.
Callback `initMap()` here defined is called from index.html file at /public/
 */

import mapStyles from './map.css';
import locations from '../../data/locations.js';


global._MAP_ = null;
global._MARKERS_ = [];

global.initMap = () => {
	_MAP_ = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -53.772172, lng: -67.710065},
		zoom: 18,
		mapTypeControl: false,
		streetViewControl: false
	});

	createMarkersForPlaces(google);
	displayLocations();
};

function displayLocations() {
	global._MARKERS_.forEach(function(marker) {
		marker.setMap(global._MAP_);
	});
}

function createMarkersForPlaces(google) {
	locations.forEach(function(location, idx) {
		var marker = new google.maps.Marker({
			position: location.position,
			title: location.title,
			animation: google.maps.Animation.DROP,
			id: idx
		});
		global._MARKERS_.push(marker);
	});
}

export default {
	createMarkersForPlaces,
	displayLocations
};