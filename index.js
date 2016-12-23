/* jshint esversion:6 */

/*
Here we bring together all dependencies and define main function.
 */

// Import basic styles
import normalizeCss from 'normalize-css/normalize.css';
import basicStyles from './lib/basicStyles.css';

// Import JS dependencies

import SideBar from './lib/sidebar/sidebar.js';
import ViewModel from './lib/viewModel/viewModel.js';
import locations from './data/locations.js';
import ko from 'knockout';

/**
 * Contains all primary logic of the application. Executed once
 * google map is loaded.
 */
global.main = () => {
	var viewModel = new ViewModel(ko, locations);
	var sideBar = new SideBar();

	// Knockout init _____________________________________________________________
	ko.applyBindings(viewModel, document.getElementById('sidebar'));

	// Initialize viewModel
	viewModel.displayOnMap();
};

// GOOGLE MAPS ERROR HANDLING __________________________________________________
document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('googleScript').addEventListener('error', () => {
		document.getElementById('map').innerHTML =
		`<div id="loadingError"
					class="bold align-center height-100 width-100 flx-dir-column flx-container flx-just-center">
			<p>Ooops! something went wrong try reloading</p>
		</div>
		`;
	});
});
