/* jshint esversion:6 */

/*
This file contains all logic related to Google Map.
Callback `initMap()` here defined is called from index.html file at /public/
 */

import mapStyles from './map.css';

class Map {
	constructor(locations=[]) {
		/*
			Holds the reference to Map object
		 */
		this.reference = new google.maps.Map(document.getElementById('map'), {
			center: {lat: -53.772172, lng: -67.710065},
			zoom: 18,
			mapTypeControl: false,
			streetViewControl: false
		});

		this.markers = [];

		this.createMarkersForPlaces(locations);
	}

	createMarkersForPlaces(locations) {
		locations.forEach(function(location, idx) {
			var marker = new google.maps.Marker({
				position: location.position,
				title: location.title,
				animation: google.maps.Animation.DROP,
				id: idx,
				_display: true
			});
			this.markers.push(marker);
		}, this);
	}
}

export default Map;
