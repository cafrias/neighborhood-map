/* jshint esversion:6 */

import Map from '../map/map.js';

class ViewModel {
	constructor(ko, locations=[]) {
		this.markers = [];
		this.filterWord = ko.observable('');
		this.hiddenMarkers = ko.observableArray();
		this.map = new Map();

		this.createMarkersForPlaces(locations);
		
		// SUBSCRIPTIONS __________________________________________
		this.filterWord.subscribe(this.filterBarAction.bind(this));

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

	checkHiddenMarker(title) {
		return this.hiddenMarkers.indexOf(title) == -1;
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

		this.filterWord(data.title);
		this.displayOnMap();
		this.map.centerOnPosition(
			this.markers.filter(
				(marker) => marker.id === data.id
			)[0].getPosition()
		);
	}

	filterBarAction(data) {
		this.filterReset();

		var regExp = new RegExp(data, 'i');

		this.markers.map((marker) => {
			if(!marker.title.match(regExp)) {
				this.hiddenMarkers.push(marker.title);
			}
		});

		this.displayOnMap();
		this.map.adjustBounds(this.markers.filter((marker) => this.hiddenMarkers.indexOf(marker.title) == -1));
	}
}

export default ViewModel;
