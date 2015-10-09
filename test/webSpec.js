var app = require('../app');

var should = require('should'),
	supertest = require('supertest');

describe('web', function () {
	it('should return user', function(done){
		supertest(app)
		.get('/users/getUser')
		.expect(200)
		.end(function(err, res){
			res.status.should.equal(200);
			done();
		});
	});

	it('should 404 when url invalid', function(done){
		supertest(app)
		.get('/haha')
		.expect(404)
		.end(function(err,res){
			res.status.should.equal(404);
			done();

		})
	})

	it('should return json', function(done){
		var user = {firstName: "Xinquan", lastName: "Zhou", email: "zhouxinquan@yahoo.com", password: "123456"};
		supertest(app)
		.post('/users/create')
		.send(user)
		.expect(200)
		.end(function(err, res){
			res.status.should.equal(200);
			done();
		})
	})

})