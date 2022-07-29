import React from 'react'
import Card from '../../components/Card';
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios';
import Web3Modal from 'web3modal'
import { API_URL, nftAddress, productsAddress } from "../../config";
import NFT from '../../../../artifacts/contracts/NFT.sol/NFT.json'
import Products from '../../../../artifacts/contracts/Products.sol/Products.json'
import Navbar from './Navbar';
import Footer from './Footer';
import { Box, Center, Container, Flex, Grid, SimpleGrid, Wrap, WrapItem } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { IoMdFingerPrint } from 'react-icons/io';
import Loader from '../../components/layout/Loader';


export default function Index() {
  const [nfts, setNFTs] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');

  useEffect(() => {
    loadNFTs()
  }, []);

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcBatchProvider(API_URL);
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const productsContract = new ethers.Contract(productsAddress, Products.abi, provider);

    const data = await productsContract.getProducts();

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
      }
      return item;
    }))
    setNFTs(items)
    setLoadingState('loaded');
  }

  if(loadingState == 'not-loaded')
    return <Loader />

  return (
    <>
      <Navbar />
      <Container maxW={'10xl'} centerContent my={10}>
        <Box>
          <SimpleGrid columns={[1, 1, 2, 3]} spacing='40px'>
            {
              loadingState == 'loaded' && !nfts.length ?
                <h1 className='px-20 py-10 text-3xl '> No items in marketplace</h1>
                : nfts.map((nft, i) => (
                  <Link to={`/product/${nft.itemId}`}>
                    <Card key={i} {...nft} />
                  </Link>
                ))
            }
          </SimpleGrid>
        </Box>
      </Container>
      <Footer />
    </>
  )

}
