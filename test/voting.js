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
      
    it("allows a voter to cast a vote", function() {
      return Voting.deployed().then(function(instance) {
        votingInstance = instance;
        plebisciteId = 1;
        return votingInstance.vote(plebisciteId, { from: accounts[0] });
      }).then(function(receipt) {
        return votingInstance.voters(accounts[0]);
      }).then(function(voted) {
        assert(voted, "the voter was marked as voted");
        return votingInstance.plebiscites(plebisciteId);
      }).then(function(plebiscite) {
        var voteCount = plebiscite[2];
        assert.equal(voteCount, 1, "increments the plebiscite's vote count");
      })
    });
    
    it("throws an exception for invalid plebiscites", function() {
      return Voting.deployed().then(function(instance) {
        votingInstance = instance;
        return votingInstance.vote(99, { from: accounts[1] })
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
        return votingInstance.plebiscites(1);
      }).then(function(plebicite1) {
        var voteCount = plebicite1[2];
        assert.equal(voteCount, 1, "plebicite 1 did not receive any votes");
        return votingInstance.plebiscites(2);
      }).then(function(plebicite2) {
        var voteCount = plebicite2[2];
        assert.equal(voteCount, 0, "plebicite 2 did not receive any votes");
      });
    });

    it("throws an exception for double voting", function() {
      return Voting.deployed().then(function(instance) {
        votingInstance = instance;
        plebisciteId = 2;
        votingInstance.vote(plebisciteId, { from: accounts[1] });
        return votingInstance.plebiscites(plebisciteId);
      }).then(function(plebiscite) {
        var voteCount = plebiscite[2];
        assert.equal(voteCount, 1, "accepts first vote");
        // Try to vote again
        return votingInstance.vote(plebisciteId, { from: accounts[1] });
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
        return votingInstance.plebiscites(1);
      }).then(function(plebiscite1) {
        var voteCount = plebiscite1[2];
        assert.equal(voteCount, 1, "plebiscite 1 did not receive any votes");
        return votingInstance.plebiscites(2);
      }).then(function(plebiscite2) {
        var voteCount = plebiscite2[2];
        assert.equal(voteCount, 1, "plebiscite 2 did not receive any votes");
      });
    });
});