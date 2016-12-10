/* jshint esversion:6 */

import sideBarStyles from './sidebar.css';

class SideBar {
	constructor(markers=[]) {
		this.instance = document.getElementById('sidebar');
		this.toggleBtn = document.getElementById('toggle-btn');
		this.crossIcon = this.toggleBtn.firstElementChild;

		this.toggleBtn.addEventListener('click', this.toggle.bind(this));

		// this.initListOfPlaces(markers);
	}

	initListOfPlaces(markers) {
		var list = document.getElementById('location-list');

		markers.forEach(function(marker) {
			var newItem = document.createElement('li');
			newItem.classList.add('loc');
			newItem.innerText = marker.title;
			newItem.setAttribute('data-id', marker.id);
			newItem.setAttribute('data-bind', 'click: ');
			list.appendChild(newItem);
		});
	}

	toggle() {
		this.instance.classList.toggle('sidebar--open');
		this.toggleBtn.classList.toggle('toggle-btn--open');
		this.crossIcon.classList.toggle('toggle-btn__cross--open');
	}
}

export default SideBar;
