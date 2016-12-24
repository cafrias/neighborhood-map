/* jshint esversion:6 */

/*
This file contains all information displayed on each marker.
This file contains per each marker:
- `position` --> lat lng for marker location
- `title` --> title of the location
- `category` --> specifies the kind of interest point, since for my city Places doesn't have accurate info
- `placeId` --> used by Google's Places Service
 */
var locations = [
	{
		title: 'Libreria Rayuela',
		position: {lat:  -53.78779, lng: -67.698502},
		placeId: 'ChIJ5ZvebFwWS7wR2P5l8EfE7-0',
		category: 'Store - Books'
	},
	{
		title: 'Tante Sara',
		position: {lat: -53.788681, lng: -67.695649},
		placeId: 'ChIJBfQEtkQWS7wRieFFAoOZaes',
		venueId: '4dcc8433ae603b786d0139a7',
		category: 'Food'
	},
	{
		title: 'Don Pepone',
		position: {lat: -53.789344, lng: -67.698187},
		placeId: 'ChIJzco2qkQWS7wRVwEVlDFygmw',
		venueId: '4db61e21f7b121c29f6d0fb9',
		category: 'Food'
	},
	{
		title: 'Status Hotel Casino',
		position: {lat: -53.788065, lng: -67.696898},
		placeId: 'ChIJT73PGlwWS7wRRawQlt56iTk',
		venueId: '4da58b785da3d30fafba427b',
		category: 'Hotel'
	},
	{
		title: 'La Usina',
		position: {lat: -53.786512, lng: -67.700149},
		placeId: 'ChIJwQJz9VwWS7wRwOX4fhy8g2E',
		category: 'Food'
	},
	{
		title: 'Centro Cultural Los Yaganes',
		position: {lat: -53.782864, lng: -67.697042},
		placeId: 'ChIJyU1H0kQWS7wRnqQ26hWinWg',
		category: 'Culture - Museum'
	},
	{
		title: 'Hospital regional rio grande',
		position: {lat: -53.781992, lng: -67.698917},
		placeId: 'ChIJf5qN6kQWS7wR1Q0PanvZJjg',
		category: 'Health - Hospital'
	},
	{
		title: 'Restaurante Narcizo',
		position: {lat: -53.787272, lng: -67.696751},
		placeId: 'ChIJHQcui1sWS7wRuzwAqLdemFI',
		venueId: '4ed816049911a3e78a6fb5fd',
		category: 'Food'
	},
	{
		title: 'Autofarma',
		position: {lat: -53.785995,lng: -67.698145},
		placeId: 'ChIJe5dWgFwWS7wRtmuxnxqZ8Ic',
		category: 'Health - Pharmacy'
	},
	{
		title: 'ABC Deportes',
		position: {lat: -53.787095, lng: -67.696378},
		placeId: 'ChIJbVN7jFsWS7wRYn07uhArY2w',
		category: 'Store - Sports'
	}
];

export default locations;
