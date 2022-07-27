
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
    const address = ['0xaE16f167ecf93b2c729952D2c03c8141137aB945']

    // Get all NFTs
    const response = await getAssetTransfers(alchemy, {
        fromBlock: "0x0",
        contractAddresses: address,
        category: ["erc721"]
    });

    // Set NFT ID
    const nftId = 875;

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
 