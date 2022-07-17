import {
    Flex,
    Circle,
    Box,
    Image,
    Badge,
    useColorModeValue,
    Icon,
    chakra,
    Tooltip,
} from '@chakra-ui/react';
import { Text } from '@chakra-ui/react'
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { FiShoppingCart } from 'react-icons/fi';
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios';
import Web3Modal from 'web3modal'
import { nftAddress, nftMarketAddress } from "../config";

import NFT from '../../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'




function Rating({ rating, numReviews }) {

    
    return (
        <Box d="flex" alignItems="center">
            {Array(5)
                .fill('')
                .map((_, i) => {
                    const roundedRating = Math.round(rating * 2) / 2;
                    if (roundedRating - i >= 1) {
                        return (
                            <BsStarFill
                                key={i}
                                style={{ marginLeft: '1' }}
                                color={i < rating ? 'teal.500' : 'gray.300'}
                            />
                        );
                    }
                    if (roundedRating - i === 0.5) {
                        return <BsStarHalf key={i} style={{ marginLeft: '1' }} />;
                    }
                    return <BsStar key={i} style={{ marginLeft: '1' }} />;
                })}
            <Box as="span" ml="2" color="gray.600" fontSize="sm">
                {numReviews} review{numReviews > 1 && 's'}
            </Box>
        </Box>
    );
}

function Card({ image, title, price, description, tokenId }) {
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
            name: meta.data.name,
            description: meta.data.description,
    
          }
    
          return item;
        }))
    
        setNFTs(items)
        setLoadingState('loaded');
      }
    // buying nft 
    async function buyNFT(tokenId, price) {
        const web3Modal = new Web3Modal()  // look for instance for etherum being injected in browser
        const connection = await web3Modal.connect() //connect to wallet  
        const provider = new ethers.providers.Web3Provider(connection); // create provider 

        const signer = provider.getSigner(); // as it is transaction we have to sign it 
        const contract = new ethers.Contract(nftMarketAddress, Market.abi, signer); // we to provider signer 
        const newPrice = ethers.utils.parseUnits(price.toString(), 'ether');
        const transaction = await contract.createMarketSale(nftAddress, tokenId, {  // call createMarketSale
            value: newPrice
        })

        await transaction.wait() // wait for transaction 
        loadNFTs(); // load page as this nft should not see in page 

    }

    return (
        <Box
            bg={useColorModeValue('white', 'gray.800')}
            maxW="sm"
            borderWidth="1px"
            rounded="lg"
            shadow="lg"
            position="relative">

            <Image
                src={image}
                alt={`Picture of ${title}`}
                roundedTop="lg"
            />

            <Box p="6">
                <Box d="flex" alignItems="baseline">

                </Box>
                <Flex mt="1" justifyContent="space-between" alignContent="center">
                    <Box
                        fontSize="2xl"
                        fontWeight="semibold"
                        as="h4"
                        lineHeight="tight"
                    >
                        {title}
                    </Box>
                    <Tooltip
                        label="Add to cart"
                        bg="white"
                        placement={'top'}
                        color={'gray.800'}
                        fontSize={'1.2em'}>
                        <chakra.a href={'#'} display={'flex'}>
                            <Icon as={FiShoppingCart} h={7} w={7} alignSelf={'center'}
                                onClick={() => buyNFT(tokenId, price)}
                            />
                        </chakra.a>
                    </Tooltip>
                </Flex>
                <Text fontSize='xl'>{description}</Text>
                <Flex justifyContent="space-between" alignContent="center">
                    <Rating rating={5} numReviews={22} />
                    <Box fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>
                        <Box as="span" color={'gray.600'} fontSize="lg">
                            £
                        </Box>
                        {price}
                    </Box>
                </Flex>
            </Box>
        </Box>
    );
}

export default Card;