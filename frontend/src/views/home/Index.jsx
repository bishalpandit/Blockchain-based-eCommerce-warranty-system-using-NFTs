import React from 'react'
import Card from '../../components/Card';
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios';
import Web3Modal from 'web3modal'
import { API_URL, nftAddress, productsAddress } from "../../config";
import NFT from '../../contracts/NFT.sol/NFT.json'
import Products from '../../contracts/Products.sol/Products.json'
import Navbar from './Navbar';
import Hero from './Hero';
import Footer from './Footer';
import { Box, Center, Container, Flex, Grid, SimpleGrid, Wrap, WrapItem, Text, Heading } from '@chakra-ui/react';
import Loader from '../../components/layout/Loader';
import { Link } from 'react-router-dom';

export default function Index() {
  const [nfts, setNFTs] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const [removeProduct, setRemoveProduct] = useState(null);
  useEffect(() => {
    loadNFTs()
  }, []);
  useEffect(() => {
    if(removeProduct) {
      let newNfts = nfts.map((nft) => {
        if(nft.itemId === removeProduct) {
          if(nft.tokenIds.length > 1) {
            const newTokenIds = [...nft.tokenIds];
            newTokenIds.pop();
            return {
              ...nfts, 
              tokenIds: newTokenIds
            }
          } else return {...nft, tokenIds: []};
        } else return nft;
      })

      console.log(newNfts, " new nfts before filter ")
      newNfts =  newNfts.filter((nft) => nft.tokenIds.length);
      console.log(newNfts, " new nfts ")
      setNFTs(newNfts);
    }
  }, [removeProduct])

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
      <Hero />
      <Container maxW={'8xl'} pt={5}>
      <Heading fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}>
        <Text
          color={"blue.400"} as={"span"}
        >
          Spotlight{" "}
        </Text>
        <Text as={"span"}>
          products you will love.{" "}
        </Text>{" "}
      </Heading>
      </Container>
      <Container maxW={'10xl'} centerContent my={10}>
        <Box>
          <SimpleGrid columns={[1, 1, 2, 3]} spacing='40px'>
            {
              loadingState == 'loaded' && !nfts.length ?
                <h1 className='px-20 py-10 text-3xl '> No items in marketplace</h1>
                : nfts.map((nft, i) => (
                  <Link to={`/product/${nft.itemId}`}>
                    <Card key={i} {...nft} setRemoveProduct={setRemoveProduct} />
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
