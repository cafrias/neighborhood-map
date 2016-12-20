/* jshint esversion:6 */

import sideBarStyles from './sidebar.css';

/**
 * Part of the UI's logic, represents the sidebar on the left of the page.
 * This class contains logic related to direct user interaction with the sidebar.
 */
class SideBar {
	/**
	 * Create a sidebar object.
	 */
	constructor() {
		this.instance = document.getElementById('sidebar');
		this.toggleBtn = document.getElementById('toggle-btn');
		this.crossIcon = this.toggleBtn.firstElementChild;

		// Bind an event listener to toggle sidebar
		this.toggleBtn.addEventListener('click', this.toggle.bind(this));
	}

	/**
	 * Helper function to toggle sidebar when user clicks on `toggleBtn`.
	 */
	toggle() {
		this.instance.classList.toggle('sidebar--open');
		this.toggleBtn.classList.toggle('toggle-btn--open');
		this.crossIcon.classList.toggle('toggle-btn__cross--open');
	}
}

export default SideBar;
