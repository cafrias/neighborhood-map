/* jshint esversion:6 */

// Import basic styles
import normalizeCss from 'normalize-css/normalize.css';
import basicStyles from './lib/basicStyles.css';

// Import JS dependencies
import map from './lib/map/map.js';
import SideBar from './lib/sidebar/sidebar.js';

function main() {
	var sideBar = new SideBar();
}

document.addEventListener('DOMContentLoaded', main);
