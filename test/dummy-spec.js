var assert = require('assert'),
		message = require('../lib/message.js');

describe('A hidden message', function() {
	it('should display a matraca-related message', function() {
		assert.equal(message(), 'Ay ay ay! tremenda matraca');
	});
});
