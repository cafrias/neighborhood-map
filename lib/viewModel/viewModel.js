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
		locations.forEach((location, idx) => {
			var marker = new google.maps.Marker({
				position: location.position,
				title: location.title,	
				animation: google.maps.Animation.DROP,
				placeId: location.placeId,
				id: idx
			});

			// Create scoped reference since `this` will be overriden in
			// the listener.
			var populateInfoWindow = this.map.populateInfoWindow;

			var locInfoWindow = new google.maps.InfoWindow();

			// Add listener on marker to open. Notice no arrow function is used as
			// callback for the listener, since arrow functions define a lexical this,
			// we won't be able to use `this` value to get the actual clicked marker.
			marker.addListener('click', function() {
				populateInfoWindow(this);
			});

			this.markers.push(marker);
		}, this);

		// Adjust Map's bounds to show all markers at start.
		this.map.adjustBounds(this.markers);
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
		this.map.adjustBounds(this.getDisplayedMarkers());
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
		this.map.adjustBounds(this.getDisplayedMarkers());
	}

	/**
	 * Returns all displayed markers (a.k.a those that aren't in `hiddenMarkers`)
	 * @return {Array} Array containing Marker references not in `hiddenMarkers`
	 */
	getDisplayedMarkers() {
		return this.markers.filter(
				(marker) => this.hiddenMarkers.indexOf(marker.title) == -1
		);
	}
}

export default ViewModel;
