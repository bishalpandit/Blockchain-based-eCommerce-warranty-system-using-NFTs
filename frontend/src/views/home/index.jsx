import React from 'react'
import ProductDetails from './ProductDetails'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Card from '../../components/Card';
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios';
import Web3Modal from 'web3modal'
import { nftAddress, nftMarketAddress } from "../../config";

import NFT from '../../../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

function Index() {
  const [nfts, setNFTs] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');

  useEffect(() => {
    loadNFTs()
  }, []);
  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcBatchProvider(); // provider for read operation
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider); // setup contract 
    const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, provider); // setup contract 
    // get tokenURI by intracting with tokenContract 
    const data = await marketContract.fetchMarketItems();

    const items = await Promise.all(data.map(async i => { // map over all the items 

      const tokenUri = await tokenContract.tokenURI(i.tokenId)  // from tokenContract get tokenUri 
      const meta = await axios.get(tokenUri) //https://ipfs-url , get meta data from ipfs 
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether');  // formated price because it comes in formate that we can't read 
      let item = { // represting nft
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        title: meta.data.title,
        description: meta.data.description,

      }

      return item;
    }))

    setNFTs(items)
    setLoadingState('loaded');
  }

 
  if (loadingState == 'loaded' && !nfts.length) return (
    <h1 className='px-20 py-10 text-3xl '> No items in marketplace</h1>
  )
  return (
    <div className='flex justify-center'>
      <div className='px-4' style={{ maxWidth: "1600px" }}>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
          {
            nfts.map((nft, i) => (
              <Card key={i} {...nft} />
            ))
          }
        </div>
      </div>

    </div>
  )
  
}

function Main() {
  return (
  <Routes>
      <Route path="/product" element={<ProductDetails />} />
      <Route path='/' element={<Index />} />
  </Routes>
  )
}

export default Main