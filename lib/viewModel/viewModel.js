/* jshint esversion:6 */

class ViewModel {
	constructor(ko, markers=[]) {
		this.markers = ko.observableArray(markers);
	}

	displayLocations(map) {
		this.markers().forEach(function(marker) {
			marker.setMap(map.reference);
		});
	}
}

export default ViewModel;
