# Voting DApp

This is a decentralized voting application (DApp) built using Solidity for the smart contract and a web interface for interacting with the smart contract. The application allows users to create proposals, vote on proposals, and retrieve the details of proposals.

## Getting Started

To get started with the Voting DApp, follow the instructions below to set up your development environment and deploy the smart contract.

## Prerequisites

- [Node.js](https://nodejs.org/) (v12.x or later)
- [MetaMask](https://metamask.io/) browser extension
- A test Ethereum network 

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/voting-dapp.git
    cd voting-dapp
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

## Usage

### Deploy the Smart Contract

1. Open the `Voting.sol` file in Remix IDE.
2. Compile the smart contract using the Solidity compiler.
3. Deploy the smart contract on a test network (e.g., Ropsten, Rinkeby, Kovan) using MetaMask.

### Update the Web Interface

1. In the `app.js` file, update the `contractAddress` variable with the address of the deployed smart contract.

### Run the Web Interface

1. Open `index.html` in your browser.
2. Connect to MetaMask to access your Ethereum account.

### Interact with the DApp

1. **Create Proposal**: Enter a proposal description and click "Create Proposal".
2. **Vote on Proposal**: Enter the index of the proposal you want to vote for and click "Vote".
3. **Get Proposal**: Enter the index of the proposal you want to retrieve and click "Get Proposal". The proposal details will be displayed below the button.

## Smart Contract

The `Voting.sol` smart contract includes the following functions:

- `createProposal(string memory _description)`: Creates a new proposal with the given description.
- `vote(uint proposalIndex)`: Votes for the proposal at the specified index.
- `getProposal(uint proposalIndex)`: Returns the description and vote count of the proposal at the specified index.

### Solidity Code

```solidity
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
```

## Web Interface

The web interface allows users to interact with the smart contract through the following functions:

- `createProposal()`: Retrieves the proposal description from the input field and calls the `createProposal` function of the smart contract.
- `vote()`: Retrieves the proposal index from the input field and calls the `vote` function of the smart contract.
- `getProposal()`: Retrieves the proposal index from the input field and calls the `getProposal` function of the smart contract. Displays the proposal details in the web interface.

### HTML and JavaScript Code

#### `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Voting DApp</title>
    <style>
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes bounceIn {
            0% {
                transform: scale(0.5);
                opacity: 0.5;
            }
            50% {
                transform: scale(1.1);
                opacity: 1;
            }
            100% {
                transform: scale(1);
            }
        }

        body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            animation: fadeIn 1s ease-in-out;
        }

        h1 {
            margin-bottom: 20px;
            animation: bounceIn 1s ease-in-out;
        }

        div {
            margin-bottom: 20px;
            text-align: center;
            animation: fadeIn 1.5s ease-in-out;
        }

        input, button {
            margin: 5px;
            padding: 10px;
            font-size: 16px;
            animation: fadeIn 2s ease-in-out;
        }

        input {
            border: 2px solid #007BFF;
            border-radius: 5px;
            transition: border-color 0.3s;
        }

        input:focus {
            border-color: #0056b3;
        }

        button {
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: #0056b3;
        }

        p {
            font-size: 16px;
        }
    </style>
</head>
<body>
    <h1>Voting DApp</h1>

    <div>
        <h2>Create Proposal</h2>
        <input type="text" id="proposalDescription" placeholder="Proposal Description">
        <button onclick="createProposal()">Create Proposal</button>
    </div>

    <div>
        <h2>Vote on Proposal</h2>
        <input type="number" id="proposalIndexVote" placeholder="Total Votes">
        <button onclick="vote()">Vote</button>
    </div>

    <div>
        <h2>Get Proposal</h2>
        <input type="number" id="proposalIndexGet" placeholder="Total Proposal">
        <button onclick="getProposal()">Get Proposal</button>
        <p id="proposalDetails"></p>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/web3/dist/web3.min.js"></script>
    <script src="app.js"></script>
</body>
</html>
```

#### `app.js`

```javascript
window.addEventListener('load', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
            console.error("User denied account access");
        }
    } else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    const contractAddress = '0x38cB7800C3Fddb8dda074C1c650A155154924C73';
    const contractABI = [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_description",
                    "type": "string"
                }
            ],
            "name": "createProposal",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "proposalIndex",
                    "type": "uint256"
                }
            ],
            "name": "vote",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "proposalIndex",
                    "type": "uint256"
                }
            ],
            "name": "getProposal",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "voteCount",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "

hasVoted",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "proposals",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "voteCount",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];

    const votingContract = new web3.eth.Contract(contractABI, contractAddress);

    window.createProposal = async () => {
        const description = document.getElementById('proposalDescription').value;
        const accounts = await web3.eth.getAccounts();
        await votingContract.methods.createProposal(description).send({ from: accounts[0] });
    };

    window.vote = async () => {
        const proposalIndex = document.getElementById('proposalIndexVote').value;
        const accounts = await web3.eth.getAccounts();
        await votingContract.methods.vote(proposalIndex).send({ from: accounts[0] });
    };

    window.getProposal = async () => {
        const proposalIndex = document.getElementById('proposalIndexGet').value;
        const result = await votingContract.methods.getProposal(proposalIndex).call();
        document.getElementById('proposalDetails').innerText = `Description: ${result.description}, Vote Count: ${result.voteCount}`;
    };
});
```

## Acknowledgements

This project uses the following open-source libraries:

- [Web3.js](https://web3js.readthedocs.io/) for interacting with the Ethereum blockchain.
- [MetaMask](https://metamask.io/) for managing Ethereum accounts and connecting to the blockchain.
