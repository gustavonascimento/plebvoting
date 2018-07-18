var Voting = artifacts.require("./Voting.sol");

contract("Voting", function(accounts) {
    var votingInstance;
    
    it("initializes with two plebiscites", function() {
        return Voting.deployed().then(function(instance) {
          return instance.plebiscitesCount();
        }).then(function(count) {
          assert.equal(count, 2);
        });
      });

    it("it initializes the plebiscites with the correct values", function() {
        return Voting.deployed().then(function(instance) {
            votingInstance = instance;
          return votingInstance.plebiscites(1);
        }).then(function(plebiscite) {
          assert.equal(plebiscite[0], 1, "contains the correct id");
          assert.equal(plebiscite[1], "A posse de armas deve ser liberada a advogados?", "contains the correct name");
          assert.equal(plebiscite[2], 0, "contains the correct votes count");
          return votingInstance.plebiscites(2);
        }).then(function(plebiscite) {
          assert.equal(plebiscite[0], 2, "contains the correct id");
          assert.equal(plebiscite[1], "A vacina a menores de 2 anos e obrigatoria?", "contains the correct name");
          assert.equal(plebiscite[2], 0, "contains the correct votes count");
        });
      });  
});