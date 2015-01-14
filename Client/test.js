/**
 * New node file
 */
/**
 * New node file
 */
var should = require('should');
var assert = require('assert');
var request = require('supertest');
var winston = require('winston');

function genRandNum() {
	return Math.floor(Math.random() * 9) + 100;
}
describe('Routing', function() {
	var url = 'http://localhost:4343';
	before(function(done) {

		done();
	});

	for(i=0;i<50;i++)
	{
		describe('Validate', function() {
			it('should pass if the random number is between 1 and 1000', function(done) {

				var profile={email: 'vj1',
						password: 'vj1'};
				request(url)
				.post('/validate')
				.send(profile)
				//.send(num)
//				end handles the response
				.end(function(err, res) {
					if (err) {
						throw err;
					}
//					this is should.js syntax, very clear
					res.should.have.status(200);
					done();
				});
			});
		});
	}

	
	
});