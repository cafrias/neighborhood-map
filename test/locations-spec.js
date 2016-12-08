var chai = require('chai'),
		expect = chai.expect,
		map = require('../lib/map/map.js'),
		sinon = require('sinon/pkg/sinon');

describe('Locations', function() {
	var google = {
		maps: {
			Animation: {}
		}
	};

	context('when displayed on map', function() {
		before(function() {
			global._MAP_ = 'mainMap';
			global._MARKERS_ = [];
		});

		beforeEach(function() {
			google.maps.Marker = sinon.spy(function() {
				this.map = null;
			});
			google.maps.Marker.prototype.setMap = function(map) {
				this.map = map;
			};

			google.maps.Animation.DROP = sinon.spy();
		});

		it('should create markers', function() {
			map.createMarkersForPlaces(google);
			expect(global._MARKERS_).to.have.lengthOf(4);
			expect(google.maps.Marker.callCount).to.be.equal(4);
		});

		it('should appear on the map', function() {
			map.createMarkersForPlaces(google);
			console.log(global._MARKERS_);
			map.displayLocations();
			expect(global._MARKERS_[0].map).to.be.deep.equal('mainMap');
		});
	});

	// TODO: when displayed on list

	after(function() {
		global._MARKERS_ = undefined;
	});
});
