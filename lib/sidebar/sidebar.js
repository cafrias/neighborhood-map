/* jshint esversion:6 */

import sideBarStyles from './sidebar.css';
import locations from '../../data/locations.js';

class SideBar {
	constructor() {
		this.instance = document.getElementById('sidebar');
		this.toggleBtn = document.getElementById('toggle-btn');
		this.crossIcon = this.toggleBtn.firstElementChild;

		this.toggleBtn.addEventListener('click', this.toggle.bind(this));

		this.initListOfPlaces();
	}

	initListOfPlaces() {
		var list = document.getElementById('location-list');

		locations.forEach(function(location) {
			var newItem = document.createElement('li');
			newItem.innerText = location.title;
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
