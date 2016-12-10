/* jshint esversion:6 */

// Import basic styles
import normalizeCss from 'normalize-css/normalize.css';
import basicStyles from './lib/basicStyles.css';

// Import JS dependencies
import Map from './lib/map/map.js';
import SideBar from './lib/sidebar/sidebar.js';
import ViewModel from './lib/viewModel/viewModel.js';
import locations from './data/locations.js';
import ko from 'knockout';

global.main = () => {
	global.map = new Map(locations);
	var viewModel = new ViewModel(ko, map.markers);
	var sideBar = new SideBar();

	ko.applyBindings(viewModel);
	viewModel.displayLocations(map);
};
