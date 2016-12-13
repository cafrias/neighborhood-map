/* jshint esversion:6 */

// Import basic styles
import normalizeCss from 'normalize-css/normalize.css';
import basicStyles from './lib/basicStyles.css';

// Import JS dependencies

import SideBar from './lib/sidebar/sidebar.js';
import ViewModel from './lib/viewModel/viewModel.js';
import locations from './data/locations.js';
import ko from 'knockout';

global.main = () => {
	var viewModel = new ViewModel(ko, locations);
	var sideBar = new SideBar();

	ko.applyBindings(viewModel, document.getElementById('sidebar'));
	viewModel.displayOnMap();
};
