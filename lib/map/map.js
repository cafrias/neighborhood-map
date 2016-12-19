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
				<div class="flx-container">
					<div class="width-66">
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

			this.setLocationInfoOnContent(marker);
			this.setStreetViewOnMarker(marker);

			this.infoWindow.open(this.reference, marker);
		}
	}

	setLocationInfoOnContent(marker) {
		var service = new google.maps.places.PlacesService(this.reference);
		
		service.getDetails({ placeId: marker.placeId }, (place, status) => {
			if(status === google.maps.places.PlacesServiceStatus.OK) {
				let extraInfoStr = '';
				console.log(place);
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
