pragma solidity ^0.4.24;

contract Voting {
    // Model a plebiscite
    struct Plebiscite {
        uint id;
        string name;
        uint votesYes;
        uint votesNo;
    }

    // Store plebiscites

    // Store accounts that have voted
    mapping(address => bool) public voters;

    // Fetch plebiscite
    mapping(uint => Plebiscite) public plebiscites;

    // Store plebiscites count 
    uint public plebiscitesCount;

    // Constructor - Smart Contracts 
    function Voting () public {
        addPlebiscite("A posse de armas deve ser liberada a advogados?");
        addPlebiscite("A vacina a menores de 2 anos e obrigatoria?");
    }

    function addPlebiscite (string _name ) private {
        plebiscitesCount ++;
        plebiscites[plebiscitesCount] = Plebiscite(plebiscitesCount, _name, 0, 0); 
    }

    function vote (uint _plebisciteId) public {
        // Require tha a voter haven't voted yet
        require(!voters[msg.sender]);

        // Require a valid plebiscite
        require(_plebisciteId > 0 && _plebisciteId <= plebiscitesCount);

        // Record that voter has voted
        voters[msg.sender] = true; 

        // Update plebiscite votes count
        plebiscites[_plebisciteId].votesYes ++;
    }
}
