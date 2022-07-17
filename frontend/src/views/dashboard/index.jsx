import {
  Box
} from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios';
import Web3Modal from 'web3modal'
import { nftAddress, nftMarketAddress } from "../../config";

import NFT from '../../../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

import SidebarWithHeader from '../../components/layout/Sidebar';
import CreateProduct from './CreateProduct';
import Main from './Main';

//Provides Layout and Routing for Dashboard

function index() {
  const [nfts, setNFTs] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');

  useEffect(() => {
    loadNFTs()
  }, []);
  async function loadNFTs() {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner()
      
      const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, signer); // setup contract 
      const tokenContract = new ethers.Contract(nftAddress, NFT.abi,  signer); // setup contract 
    
      // get tokenURI by intracting with tokenContract 
      const data = await marketContract.fetchMyNFTs();
      console.log("all data ", data)
      const items = await Promise.all(data.map(async i => { // map over all the items 
          const tokenUri = await tokenContract.tokenURI(i.tokenId)  // from tokenContract get tokenUri 
          console.log("token uri ", tokenUri)
          const meta = await axios.get(tokenUri) //https://ipfs-url , get meta data from ipfs 
          let price = ethers.utils.formatUnits(i.price.toString(), 'ether');  // formated price because it comes in formate that we can't read 
          let item = { // represting nft
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            title: meta.data.title, 
    
          }
          return item;
        }))
    
        setNFTs(items)
        console.log("Your item list", items);
        setLoadingState('loaded');
  }

  return (
    <Box>
      <SidebarWithHeader>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/create-product' element={<CreateProduct />}/>
        </Routes>
      </SidebarWithHeader>
    </Box>
  )
}

export default index