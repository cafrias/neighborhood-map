/* jshint esversion:6 */

import Map from '../map/map.js';

/**
 * Class containing the ViewModel logic.
 */
class ViewModel {
	/**
	 * Create a `ViewModel` instance
	 * @param  {Knockout} ko       Main Knockout instance of the application.
	 * @param  {Array}  locations  Array containing location objects.
	 */
	constructor(ko, locations=[]) {
		/**
		 * Hold all Marker instances in the application.
		 * @type {Array}
		 */
		this.markers = [];

		/**
		 * Hold Marker instance's titles of those that are not displayed on the Map.
		 * @type {ObservableArray}
		 */
		this.hiddenMarkers = ko.observableArray();

		/**
		 * Hold a string used to filter Markers based on their titles.
		 * @type {Observable}
		 */
		this.filterWord = ko.observable('');

		/**
		 * Application's Google Maps instance
		 * @type {Map}
		 */
		this.map = new Map();

		this.createMarkersForLocs(locations);

		// CREATE LISTENERS ________________________________________________________

		// Adjusts map's bounds each time client application changes window size, as
		// suggested by project's reviewer.
		google.maps.event.addDomListener(window, 'resize', () => {
			this.map.adjustBounds(this.markers);
		});
		
		// KO SUBSCRIPTIONS ________________________________________________________

		// Whenever filterWord is changed, filterBarAction will be executed.
		// This logic is here as part of the search bar requirement.
		this.filterWord.subscribe(this.filterBarAction.bind(this));

		// BINDINGS ________________________________________________________________
		this.filterClickAction = this.filterClickAction.bind(this);
	}

	/**
	 * Create markers for each location passed in `locations` and store them in
	 * `this.markers`.
	 * @param  {Array}  locations  Array containing location objects.
	 */
	createMarkersForLocs(locations=[]) {
		locations.forEach((location, idx) => {
			var marker = new google.maps.Marker({
				position: location.position,
				title: location.title,	
				animation: google.maps.Animation.DROP,
				placeId: location.placeId,
				map: this.map.reference,
				id: idx
			});

			// Create scoped reference since `this` will be overriden in
			// the listener.
			var populateInfoWindow = this.map.populateInfoWindow,
					animateClickedMarker = this.animateClickedMarker;

			var locInfoWindow = new google.maps.InfoWindow();

			// Add listener on marker to open. Notice no arrow function is used as
			// callback for the listener, since arrow functions define a lexical this,
			// we won't be able to use `this` value to get the actual clicked marker.
			marker.addListener('click', function() {
				animateClickedMarker(this);
				populateInfoWindow(this);
			});
			this.markers.push(marker);
		}, this);

		// Adjust Map's bounds to show all markers at start.
		this.map.adjustBounds(this.markers);
	}

	/**
	 * Animate clicked marker with 'BOUNCE' animation style.
	 * @param  {Marker} marker Marker instance to animate.
	 */
	animateClickedMarker(marker) {
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}

	/**
	 * Show on Map all markers that are not in `hiddenMarkers`.
	 */
	displayOnMap() {
		this.getDisplayedMarkers().forEach((marker) => {
			marker.setVisible(true);
		});
	}

	/**
	 * Return all displayed markers (a.k.a those that aren't in `hiddenMarkers`)
	 * @return {Array} Array containing Marker references not in `hiddenMarkers`
	 */
	getDisplayedMarkers() {
		return this.markers.filter(
				(marker) => this.hiddenMarkers.indexOf(marker.title) == -1
		);
	}

	/**
	 * Reset all filter applied before by removing all elements in `hiddenMarkers`
	 * and unsetting all markers from the Map (so they are no longer displayed).
	 */
	filterReset() {
		this.hiddenMarkers.removeAll();
		this.markers.forEach((marker) => {
			marker.setVisible(false);
		});
	}

	/**
	 * Check whether a given Marker is hidden or not. Receives a Marker's title as
	 * parameter for performing the check, since `hiddenMarkers` only holds Markers' `title`.
	 * 
	 * @param  {string} title  A Marker's title to perform the check.
	 * @return {boolean}       `true` if the marker is hidden, `false` otherwise.
	 */
	checkHiddenMarker(title='') {
		return this.hiddenMarkers.indexOf(title) == -1;
	}

	/**
	 * Reset the Map view and Markers to the initial state of the application.
	 */
	resetAction() {
		this.map.closeInfoWindow();
		this.filterReset();
		this.displayOnMap();
		this.map.adjustBounds(this.getDisplayedMarkers());
	}

	/**
	 * Show on Map only the Marker clicked, selected from the list in the sidebar.
	 * @param  {Marker} data Clicked Marker instance
	 */
	filterClickAction(data) {	
		this.filterReset();

		this.markers.forEach((marker) => {
			if(marker.id !== data.id) {
				this.hiddenMarkers.push(marker.title);
			}
		}, this);

		this.filterWord(data.title);

		this.animateClickedMarker(data);
		this.map.populateInfoWindow(data);

		this.displayOnMap();
		this.map.centerOnPosition(
			this.markers.filter(
				(marker) => marker.id === data.id
			)[0].getPosition()
		);
	}

	/**
	 * Hide all markers no containing the string passed in `data` in their titles.
	 * @param  {string} data String used to filter based on Marker's title.
	 */
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
}

export default ViewModel;
