/* jshint esversion:6 */

class SideBar {
	constructor() {
		this.instance = document.getElementById('sidebar');
		this.toggleBtn = document.getElementById('toggle-btn');
		this.crossIcon = this.toggleBtn.firstElementChild;
		this.toggleBtn.addEventListener('click', this.toggle.bind(this));
	}

	toggle() {
		this.instance.classList.toggle('sidebar--open');
		this.toggleBtn.classList.toggle('toggle-btn--open');
		this.crossIcon.classList.toggle('toggle-btn__cross--open');
	}
}

export default SideBar;
