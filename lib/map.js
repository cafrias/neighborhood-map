/* jshint esversion:6 */

/*
This file contains all logic related to Google Map.
Callback `initMap()` here defined is called from index.html file at /public/
 */

import mapStyles from './styles/map.css';

window._MAP_ = null;
window._MARKERS_ = [];

window.initMap = () => {
	_MAP_ = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -53.772172, lng: -67.710065},
		zoom: 18,
		mapTypeControl: false,
		streetViewControl: false
	});
};
