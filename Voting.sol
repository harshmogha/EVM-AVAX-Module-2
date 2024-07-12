// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Proposal {
        string description;
        uint voteCount;
    }

    Proposal[] public proposals;
    mapping(address => bool) public hasVoted;

    function createProposal(string memory _description) public {
        proposals.push(Proposal({
            description: _description,
            voteCount: 0
        }));
    }

    function vote(uint proposalIndex) public {
        require(!hasVoted[msg.sender], "You have already voted.");
        require(proposalIndex < proposals.length, "Invalid proposal index.");

        proposals[proposalIndex].voteCount += 1;
        hasVoted[msg.sender] = true;
    }

    function getProposal(uint proposalIndex) public view returns (string memory description, uint voteCount) {
        require(proposalIndex < proposals.length, "Invalid proposal index.");
        Proposal storage proposal = proposals[proposalIndex];
        return (proposal.description, proposal.voteCount);
    }
}
