var chai = require('chai'),
		expect = chai.expect,
		Filter = require('../lib/filter/filter.js'),
		sinon = require('sinon/pkg/sinon');

describe('Filter locations', function() {
	var filter = new Filter();

	before(function() {
		// Hard code dummy markers
		global._MARKERS_ = [
			{
				id: 0,
				title: 'Coffee shop'
			},
			{
				id: 1,
				title: 'Tea shop'
			}
		];

		// In this variable we will hold hidden markers
		global._HIDDEN_MARKERS_ = [];
	});

	context('using search bar', function() {
		it('should hide a marker', function() {

		});

		// several markers
		// all
	});
	// TODO: using list
	
	after(function() {
		global._MARKERS_ = undefined;
	});
});
