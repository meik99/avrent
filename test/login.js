var app = require("../app.js");
var should = require("should");
var supertest = require("supertest")(app);

describe("Tests module: Login", function(){
  it("Should respond with token", function(done){
    supertest
      .post("/login/")
      .expect(200)
      .end(function(err, result){
        result.body.token.should.not.equal(undefined);
        result.body.token.should.not.equal(undefined);
        result.body.token_date.should.not.equal(null);
        result.body.token_date.should.not.equal(null);

        done();
      });
  });
});
