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
			zoom: 18,
			mapTypeControl: false,
			streetViewControl: false
		});

		/**
		 * Holds a reference to the unique InfoWindow instance used in the application.
		 * @type {InfoWindow}
		 */
		this.infoWindow = new google.maps.InfoWindow();

		// HELPER METHODS FOR infoWindow _________________________
		
		// Monkey patching! I don't think it's the best solution but at least cleaner
		// than a helper function on Map.prototype
		// This function simply replaces the content where a pattern exists, it's good
		// for those place holders I use below.
		this.infoWindow.replacePatternInContent = function(pattern=false, substr=false) {
			if(!pattern || !substr) {
				throw new Error('You should set both `pattern` and `substr` parameters.');
			}

			this.setContent(this.getContent().replace(pattern, substr));
		};

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
			this.infoWindow.marker = marker;

			// Make sure the marker property is cleared if infowindow is closed.
			this.infoWindow.addListener('closeclick', () => {
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
						<ul class="ul-no-bullet pad-space">
							<!--extraInfo-->
						</ul>
					</div>
					<div id="pano"></div>
				</div>
				`
			);

			this.setLocationInfoOnContent(marker.placeId);
			this.setStreetViewOnMarker(marker);

			this.infoWindow.open(this.reference, marker);
		}
	}

	/**
	 * Sets location information on `infoWindow.content`, granted that `infowWindow.content`
	 * has been prepopullated with placeholders, which allows to specify where in
	 * the string to place the HTML code generated, those are:
	 * - `<!--address-->` indicates where to put all HTML code related to address information.
	 * - `<!--extraInfo-->` indicates where to put all HTML code related to extra information about the place.
	 * 
	 * @param {String} placeId placeId of the place to get information from using Google Places Service.
	 */
	setLocationInfoOnContent(placeId) {
		var service = new google.maps.places.PlacesService(this.reference);
		
		service.getDetails({ placeId }, (place, status) => {
			if(status === google.maps.places.PlacesServiceStatus.OK) {
				let extraInfoStr = '';
				this.infoWindow.replacePatternInContent(
					'<!--address-->',
					place.formatted_address || 'No address found'
				);

				// extraInfo section __________
				if(place.formatted_phone_number) {
					extraInfoStr +=
					`
						<li>
							<span class="infowindow__info__phone">
								${place.formatted_phone_number}
							</span>
						</li>
					`;
				}

				if(place.website) {
					extraInfoStr +=
					`
						<li>
							<a href="${place.website}">Website</a>
						</li>
					`;
				}

				if(place.opening_hours) {
					extraInfoStr +=
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

				this.infoWindow.replacePatternInContent(
					'<!--extraInfo-->',
					extraInfoStr
				);
			}
		});
	}

	/**
	 * Adds Streetview of given place represented by `marker` in `infoWindow.content`.
	 * @param {Marker} marker A Marker instance related to `infoWindow`
	 */
	setStreetViewOnMarker(marker) {
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
					pano.innerText = 'No Street View image found';
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
		this.reference.setZoom(18);
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
