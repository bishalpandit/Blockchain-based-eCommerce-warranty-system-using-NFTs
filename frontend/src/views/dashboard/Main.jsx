import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios';
import Web3Modal from 'web3modal'
import { nftAddress, productsAddress } from "../../config";

import NFT from '../../../../artifacts/contracts/NFT.sol/NFT.json'
import Products from '../../../../artifacts/contracts/Products.sol/Products.json'
import Card from '../../components/Card';

function Main() {
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

    const productsContract = new ethers.Contract(productsAddress, Products.abi, signer);
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, signer);

    // get tokenURI by intracting with tokenContract 
    const data = await productsContract.getMyProducts();

    const items = await Promise.all(data.map(async i => {

      const tokenUri = await tokenContract.tokenURI(i.tokenIds[0])
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
      let tokenIds = i.tokenIds.map((token) => token.toString());
      let item = {
        itemId: i.itemId.toString(),
        price,
        tokenIds,
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        title: meta.data.title,
        description: meta.data.description,
        warrantyPeriod: i.warrantyPeriod,
        warrantyEndDate: new Date(i.warrantyEndDate.toNumber() * 1000)
      }
      return item;

    }))

    console.log("My nfts ", items)
    setNFTs(items)
    setLoadingState('loaded');
  }

  return (
    <Flex justify="center" align="center" h="100%">
      {
        !nfts.length ?
          <Heading mt={8}>
            No items in your list
          </Heading>
          :
          nfts.map((nft, i) =>
            <GridItem key={i} w='100%' h='10'>
              <Card {...nft} />
            </GridItem>
          )
      }

    </Flex>
  )
}

export default Main