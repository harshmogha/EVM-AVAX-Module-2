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
            "name": "hasVoted",
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
