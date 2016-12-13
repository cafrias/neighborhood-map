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
	}

	// TODO: center on point function
}

export default Map;
