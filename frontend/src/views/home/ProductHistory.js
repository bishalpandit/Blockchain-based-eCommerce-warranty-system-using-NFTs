
    const { initializeAlchemy, getAssetTransfers } = require('@alch/alchemy-sdk');
const web3 = require('web3')

// Alchemy app API key
const settings = {
    // apiKey: 'u8T-DCJZrAIHBwsyaZFDkggbSgKjIhqX',
    apiKey: 'u8T-DCJZrAIHBwsyaZFDkggbSgKjIhqX',
};

const alchemy = initializeAlchemy(settings);

const main = async () => {
    
    // Contract address
    const address = ['0xb38BA0Ea0Eb7B7899E5F8CcA9b35827c7931C102']

    // Get all NFTs
    const response = await getAssetTransfers(alchemy, {
        fromBlock: "0x0",
        contractAddresses: address,
        category: ["erc721"],
        excludeZeroValue: false
    });

    // Set NFT ID
    const nftId = "1111";

    // Get transactions for the NFT
    txns = response['transfers'].filter(txn => web3.utils.hexToNumber(txn['erc721TokenId']) === nftId)
    console.log(txns)
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();
 