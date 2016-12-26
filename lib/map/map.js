/* jshint esversion:6 */

import mapStyles from './map.css';

/**
 * This class wraps all logic related to Google Maps, holding an active instance
 * of `google.maps.Map` to be used through the application.
 */
class Map {
	/**
	 * Creates a new Map instance.
	 */
	constructor() {
		/**
		 * Holds a reference to `google.maps.Map` used throughout the application.
		 * @type {Map}
		 */
		this.reference = new google.maps.Map(document.getElementById('map'), {
			center: {lat: -53.772172, lng: -67.710065},
			zoom: 15,
			mapTypeControl: false,
			streetViewControl: false
		});

		/**
		 * Holds a reference to the unique InfoWindow instance used in the application.
		 * @type {InfoWindow}
		 */
		this.infoWindow = new google.maps.InfoWindow();

		// BINDING _______________________________________________
		this.populateInfoWindow = this.populateInfoWindow.bind(this);
	}

	/**
	 * Populates InfoWindow with HTML code displaying:
	 * - Streetview of the place in the marker
	 * - Information related to the place in the marker
	 * 
	 * @param  {Marker} marker Marker instance used to display the InfoWindow
	 */
	populateInfoWindow(marker) {
		if(this.infoWindow.marker != marker) {

			// Reset info window.
			this.infoWindow.setContent('');
			if(this.infoWindow.marker) this.infoWindow.marker.setAnimation(null);
			this.infoWindow.marker = marker;

			// Make sure the marker property is cleared if infowindow is closed.
			this.infoWindow.addListener('closeclick', () => {
				if(this.infoWindow.marker) this.infoWindow.marker.setAnimation(null);
				this.infoWindow.marker = null;
			});

			// Pre-populate infoWindow before adding location information
			this.infoWindow.setContent(
			`
			<div id="infoWindow" class="flx-container">
				<div id="extraInfo" class="width-66">
					<header class="infowindow__heading">
						<h1 class="infowindow__heading__main">${marker.title}</h1>
						<p id="address" class="italic"><!--address--></p>
					</header>
					<!--error-->
					<ul class="ul-no-bullet pad-space">
						<li>
							<span class="bold">Category: </span> ${marker.category}
						</li>
						<!--foursquareInfo-->
						<!--extraInfo-->
					</ul>
				</div>
				<div id="pano"></div>
			</div>
			`);

			this.getAsyncData(marker)
				.then((data) => {
					// Fist load data on info window, this prevents from removing
					// the streetView content if gets loaded first.
					this.loadDataOnInfoWindow(data);
					this.loadStreetView(marker);	
				})
				.catch((error) => {
					console.log(error);
					this.loadErrorMessage();
				})
			;

			this.infoWindow.open(this.reference, marker);
		}
	}

	/**
	 * Load error message on Info Window opened by the user if any error during
	 * data fetching happened.
	 */
	loadErrorMessage() {
		var windowText = this.infoWindow.getContent();

		windowText = windowText.replace(
			'<!--error-->',
			`<p class="window-error">
				Couldn\'t load external data! Try reloading.
			<p>`
		);

		this.infoWindow.setContent(windowText);
	}

	/**
	 * Load data onto infoWindow content by replacing the preformatted string with
	 * data passed in `data` parameter.
	 * @param  {Object} data Data fetched from Async resources
	 */
	loadDataOnInfoWindow(data) {
		var windowText = this.infoWindow.getContent();

		// Set data for foursquare.
		if(data.foursquare) {
			windowText = windowText.replace(
				'<!--foursquareInfo-->',
				`
				<li>
					<span class="bold">Foursquare rating:</span>
					${data.foursquare.rating || '--'}/10
				</li>
				`
			);
		} else {
			windowText = windowText.replace(
				'<!--foursquareInfo-->',
				`
				<li>
					<span class="italic">No Foursquare info found.</span>
				</li>
				`
			);
		}

		// --> Set data for Google Places.
		{
			let placeStr = '',
					place = data.place;

			// Set address data.
			windowText = windowText.replace(
				'<!--address-->',
				data.place.formatted_address || 'No address found'
			);

			if(place.formatted_phone_number) {
				placeStr +=
				`
					<li>
						<span class="bold">Phone: </span>
						${place.formatted_phone_number}
					</li>
				`;
			}

			if(place.website) {
				placeStr +=
				`
					<li>
						<a href="${place.website}">Website</a>
					</li>
				`;
			}

			if(place.opening_hours) {
				placeStr +=
				`
					<li>
						<span class="upper bold">
							${place.opening_hours.open_now ? 'Open Now' : 'Closed Now'}
						</span>
					</li>
					<li> <span>Open hours:</span>
						<ul class="ul-no-bullet pad-space">
							<li>${place.opening_hours.weekday_text[0]}</li>
							<li>${place.opening_hours.weekday_text[1]}</li>
							<li>${place.opening_hours.weekday_text[2]}</li>
							<li>${place.opening_hours.weekday_text[3]}</li>
							<li>${place.opening_hours.weekday_text[4]}</li>
							<li>${place.opening_hours.weekday_text[5]}</li>
							<li>${place.opening_hours.weekday_text[6]}</li>
						</ul>
					</li>
				`;
			}

			windowText = windowText.replace(
				'<!--extraInfo-->',
				placeStr
			);
		}
		// <-- END set data for google places


		// Set infoWindow content with newly modified string.
		this.infoWindow.setContent(windowText);
	}

	/**
	 * Get data from Async resources. The promise returned behaves as follows:
	 * - Resolved: Returns an object containing data fetched from external resources.
	 * - Rejected: Returns array containing error messages.
	 * @param  {Marker} marker A marker instance from which to get data for AJAX requests
	 * @return {Promise}        A promise, resolved=>Object, rejected=>Array
	 */
	getAsyncData(marker) {
		return new Promise((resolve, reject) => {
			Promise.all([
				this.getFoursquareData.call(this, marker.venueId || false),
				this.getPlaceInfoData.call(this, marker.placeId)
			])
				.then(function(success) {
					resolve({
						foursquare: success[0],
						place: success[1],
						streetView: success[2]
					});
				})
				.catch(function(error) {
					reject(error);
				})
			;
		});
	}

	/**
	 * Get data from Foursquare API. Promise returned behaves as follows:
	 * - Resolved: Returns object containing data fetched from Foursquare API.
	 * - Rejected: Returns string with error message
	 * @param  {string} venueId Foursquare valid venueId
	 * @return {Promise}         A promise, resolved=>Object, rejected=>string
	 */
	getFoursquareData(venueId) {
		// We return undefined if the place has no Foursquare venue Id.
		if(venueId === false) return;

		return new Promise(function(resolve, reject) {
			// Foursquare Credentials
			var clientId='NYCWRKZ0J5DU51MHNVCONP03345RUKBCP1MFSYBNU3UYLR55',
					clientSecret='1UXWASOVEN2IXK3CTNI3IYZ5DFZQNDZBWFOPN525MMEZ34OX',
					URI = `https://api.foursquare.com/v2/venues/${venueId}?client_id=${clientId}&client_secret=${clientSecret}&v=20170401`;

			fetch(URI)
			.then(function(response) {
				if(response.statusText == 'OK') {
					return response.json();
				} else {
					throw new Error('Internal error check credentials.');
				}
			})
			.then(function(response) {
				// TODO: test changing creadential for gettin internal error
				var {rating} = response.response.venue;
				resolve({rating});
			})
			.catch(function(error) {
				// TODO: test error!
				console.log(error);
				reject('Couldn\'t fetch data from Foursquare API.');
			});
		});
	}

	/**
	 * Get data from Google Places API. Promise returned behaves as follows:
	 * - Resolved: Returns object containing data fetched from Google Places API.
	 * - Rejected: Returns string with error message.
	 * @param  {string} placeId Google Places API valid placeId
	 * @return {Promise}         A promise, resolved=>Object, rejected=>string
	 */
	getPlaceInfoData(placeId) {
		return new Promise((resolve, reject) => {
			var service = new google.maps.places.PlacesService(this.reference);
		
			service.getDetails({ placeId }, (place, status) => {
				if(status === google.maps.places.PlacesServiceStatus.OK) {
					resolve(place);
				} else {
					reject('Couldn\'t fetch data from Google Places API');
				}
			});
		});
	}

	/**
	 * Close `infoWindow`
	 */
	closeInfoWindow() {
		this.infoWindow.marker = null;
		this.infoWindow.close();
	}

	/**
	 * Adds Streetview of given place represented by `marker` in `infoWindow.content`.
	 * @param {Marker} marker A Marker instance related to `infoWindow`
	 */
	loadStreetView(marker) {
		var streetViewService = new google.maps.StreetViewService(),
				radius = 50,
				panoElem = document.getElementById('pano');

		streetViewService.getPanoramaByLocation(marker.position, 50,
			(data, status) => {
				if(status == google.maps.StreetViewStatus.OK) {
					var nearStreetViewLocation = data.location.latLng,
							heading = google.maps.geometry.spherical.computeHeading(
								nearStreetViewLocation,
								marker.position
							),
							panorama = null;

					panorama = new google.maps.StreetViewPanorama(
							document.getElementById('pano'),
							{ position: nearStreetViewLocation,
								pov: {
									heading,
									pitch: 20
								}
							}
					);
				} else {
					panoElem.innerText = 'No streetView image found.';
				}
			}
		);
	}

	/**
	 * Centers the map on a given position
	 * @param  {Object} position Position to center the map on, should contain `lat` and `lng` properties.
	 */
	centerOnPosition(position={lat: -53.772172, lng: -67.710065}) {
		this.reference.setCenter(position);
		this.reference.setZoom(17);
	}

	/**
	 * Adjusts map's bounds to show all markers passed on `markers`.
	 * @param  {Array} markers A list of Marker instances
	 */
	adjustBounds(markers) {
		var bounds = new google.maps.LatLngBounds();

		markers.forEach((marker) => {
			bounds.extend(marker.position);
		});

		this.reference.fitBounds(bounds);
	}
}

export default Map;
