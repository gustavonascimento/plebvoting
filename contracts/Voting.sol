pragma solidity ^0.4.24;

contract Voting {
    // Model a plebiscite
    struct Plebiscite {
        uint id;
        string name;
        uint votes;
    }

    // Store plebiscites

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
        plebiscites[plebiscitesCount] = Plebiscite(plebiscitesCount, _name, 0); 
    }
}
