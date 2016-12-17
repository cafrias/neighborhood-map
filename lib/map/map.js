/* jshint esversion:6 */

/*
This file contains all logic related to Google Map.
Callback `initMap()` here defined is called from index.html file at /public/
 */

import mapStyles from './map.css';

class Map {
	constructor() {
		/*
			Holds the reference to Map object
		 */
		this.reference = new google.maps.Map(document.getElementById('map'), {
			center: {lat: -53.772172, lng: -67.710065},
			zoom: 18,
			mapTypeControl: false,
			streetViewControl: false
		});

		this.infoWindow = new google.maps.InfoWindow();

		// BINDING _______________________________________________
		this.populateInfoWindow = this.populateInfoWindow.bind(this);
	}

	populateInfoWindow(marker) {
		if(this.infoWindow.marker != marker) {
			// Reset info window.
			this.infoWindow.setContent('');
			this.infoWindow.marker = marker;

			// Make sure the marker property is cleared if infowindow is closed.
			this.infoWindow.addListener('closeclick', () => {
				this.infoWindow.marker = null;
			});

			this.infoWindow.setContent('matraca!!');
			this.infoWindow.open(this.reference, marker);
			console.log('called');
		}
	}

	centerOnPosition(position={lat: -53.772172, lng: -67.710065}) {
		this.reference.setCenter(position);
		this.reference.setZoom(18);
	}

	adjustBounds(markers) {
		var bounds = new google.maps.LatLngBounds();

		markers.forEach((marker) => {
			bounds.extend(marker.position);
		});

		this.reference.fitBounds(bounds);
	}
}

export default Map;
