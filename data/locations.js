/* jshint esversion:6 */

/*
This file contains all information displayed on each marker.
This file contains per each marker:
- `position` --> lat lng for marker location
- `title` --> title of the location

For searching for positions using web API:
https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyDlp-FPcPhdPG9CVOeYcKGkOKbRSIgVbfQ&position=-53.769711,-67.716422&radius=30
 */
var locations = [
	{
		title: 'Sanatorio Fueguino',
		position: {lat: -53.7707509, lng: -67.70989999999999}
	},
	{
		title: 'Nuevo Centro',
		position: {lat: -53.772523, lng: -67.7107274}
	},
	{
		title: 'GECALCTDF',
		position: {lat: -53.7722445, lng: -67.7097618}
	},
	{
		title: 'Soki Studio',
		position: {lat: -53.77077949999999, lng: -67.7116635}
	},
	{
		title: 'Solo Música',
		position: {lat: -53.7714647, lng: -67.7128068}
	},
	{
		title: 'Veterinaria Leiva',
		position: {lat: -53.77277239999999, lng: -67.7106228}
	},
	{
		title: 'Heladeria Almendra',
		position: {lat: -53.76965, lng: -67.716453}
	},
	{
		title: 'Stylos Coiffeur',
		position: {lat: -53.7696769, lng: -67.71630669999999}
	},
	{
		title: 'Farmacia del Pueblo II',
		position: {lat: -53.769576, lng: -67.71649649999999}
	},
	{
		title: 'Multirubro Las Vegas',
		position: {lat: -53.7695717, lng: -67.7166314}
	},
	{
		title: 'Ksanuova Pizza Bar',
		position: {lat: -53.76946710000001, lng: -67.7165602}
	}
];

export default locations;
