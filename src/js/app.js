App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Voting.json", function(voting) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Voting = TruffleContract(voting);
      // Connect provider to interact with contract
      App.contracts.Voting.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var votingInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.Voting.deployed().then(function(instance) {
      votingInstance = instance;
      return votingInstance.plebiscitesCount();
    }).then(function(plebiscitesCount) {
      var plebiscitesResults = $("#plebiscitesResults");
      plebiscitesResults.empty();

      var votesSelect = $('#votesSelect')
      votesSelect.empty();

      for (var i = 1; i <= plebiscitesCount; i++) {
        votingInstance.plebiscites(i).then(function(plebiscite) {
          var id = plebiscite[0];
          var name = plebiscite[1];   
          var votesYes = plebiscite[2];
          var votesNo = plebiscite[3];

          // Render plebiscite Result
          var plebisciteTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + votesYes + "</td></tr>" + votesNo + "</td></tr>"
          plebiscitesResults.append(plebisciteTemplate);

          // Render votes 
          var votesOption = "<option value>" + votesYes + " Sim" + "</ option>" + "<option value>" + votesNo + " Não" + "</ option>"
          votesSelect.append(votesOption);
        });
      }
      return votingInstance.voters(App.account);
      }).then(function(hasVoted) {
        // Do not allow a user to vote
        if(hasVoted) {
          $('form').hide();
        }
        loader.hide();
        content.show();
      }).catch(function(error) {
        console.warn(error);
      });
    },

    castVote: function() {
      var plebisciteId = $('#votesSelect').val();
      App.contracts.Voting.deployed().then(function(instance) {
        return instance.vote(plebisciteId, { from: App.account });
      }).then(function(result) {
        // Wait for votes to update
        $("#content").hide();
        $("#loader").show();
      }).catch(function(err) {
        console.error(err);
      });
    }
  };

$(function() {
  $(window).load(function() {
    App.init();
  });
}); 