var app = require("../app");
var should = require("should");
var supertest = require("supertest")(app);

describe("Tests module: Login", function(done){
  it("Should respond with token", function(){
    supertest
      .post("/login/")
      .expected(200)
      .end(function(err, result){
        result.body.token.should.not.equal(undefined);
        result.body.token_date.should.not.equal(undefined);
      });
  });
});
