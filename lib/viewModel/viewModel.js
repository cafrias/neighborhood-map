/* jshint esversion:6 */

import Map from '../map/map.js';

class ViewModel {
	constructor(ko, locations=[]) {
		this.markers = [];
		this.hiddenMarkers = ko.observableArray();
		this.map = new Map();

		this.createMarkersForPlaces(locations);
		
		this.filterClickAction = this.filterClickAction.bind(this);
	}

	createMarkersForPlaces(locations) {
		locations.forEach(function(location, idx) {
			var marker = new google.maps.Marker({
				position: location.position,
				title: location.title,	
				animation: google.maps.Animation.DROP,
				id: idx
			});
			this.markers.push(marker);
		}, this);
	}

	displayOnMap() {
		this.markers.forEach((marker) => {
			if(this.hiddenMarkers.indexOf(marker.title) == -1) {
				marker.setMap(this.map.reference);
			}
		}, this);
	}

	filterReset() {
		this.hiddenMarkers.removeAll();
		this.markers.forEach((marker) => {
			marker.setMap(null);
		});
	}

	resetAction() {
		this.filterReset();
		this.displayOnMap();
	}

	filterClickAction(data) {	
		this.filterReset();

		this.markers.forEach((marker) => {
			if(marker.id !== data.id) {
				this.hiddenMarkers.push(marker.title);
			}
		}, this);

		this.displayOnMap();
	}

	checkHiddenMarker(title) {
		return this.hiddenMarkers.indexOf(title) == -1;
	}
}

export default ViewModel;
