
// import NFT from '../../../../artifacts/contracts/NFT.sol/NFT.json'
const Products = require('../../../../artifacts/contracts/Products.sol/Products.json')
// import { API_URL, nftAddress, productsAddress } from "../../config";
const Web3 = require('web3')
const productsAddress = "0x1BFC2b9B133cb1b803BD46F4143598FFCa8c1c70"
var currentProvider = new Web3.providers.HttpProvider('http://localhost:8545');
const web3 = new Web3(currentProvider);

const productWeb3 = new web3.eth.Contract(Products.abi, productsAddress);

productWeb3.getPastEvents('Transfer', {
  // filter: { tokenId: 11 }, // Using an array means OR: e.g. 20 or 23
  fromBlock: 0,
  toBlock: 'latest'
}, function (error, events) { console.log(events); })
  .then(function (events) {
    console.log(events) // same results as the optional callback above
  });