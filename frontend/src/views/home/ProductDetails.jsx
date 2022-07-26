import {
    Box,
    Container,
    Stack,
    Text,
    Image,
    Flex,
    Button,
    Heading,
    SimpleGrid,
    StackDivider,
    useColorModeValue,
    List,
    ListItem,
    ChakraProvider
} from '@chakra-ui/react';
import Web3Modal from 'web3modal';
import { BigNumber, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Products from '../../../../artifacts/contracts/Products.sol/Products.json';
import NFT from '../../../../artifacts/contracts/NFT.sol/NFT.json';
import { nftAddress, productsAddress } from "../../config";
import Navbar from './Navbar';


export default function ProductDetails() {
    const [product, setProduct] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        loadNFTById();
    }, []);

    async function loadNFTById() {
        const provider = new ethers.providers.JsonRpcBatchProvider();
        const productContract = new ethers.Contract(productsAddress, Products.abi, provider);
        const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);

        const product = await productContract.getProductById(BigNumber.from(id));
        const tokenUri = await tokenContract.tokenURI(product.tokenIds[0]);
        const meta = (await axios.get(tokenUri)).data;
        let price = ethers.utils.formatUnits(product.price.toString(), 'ether');

        const tokens = await Promise.all(product.tokenIds.map(async t => {
            return t.toNumber();
        }));

        setProduct({
            ...product,
            tokens,
            price,
            image: meta.image
        });
    }

    async function buyNFT() {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);

        const signer = provider.getSigner();
        const productsContract = new ethers.Contract(productsAddress, Products.abi, signer); // we to provider signer 
        const newPrice = ethers.utils.parseUnits(price.toString(), 'ether');
        const transaction = await contract.createMarketSale(nftAddress, tokenId, {  // call createMarketSale
            value: newPrice
        })

        await transaction.wait() // wait for transaction 
        loadNFTs(); // load page as this nft should not see in page 

    }

    if (!product)
        return;

    return (
        <>
            <Navbar />
            <Container maxW={'7xl'}>
                <SimpleGrid
                    columns={{ base: 1, lg: 2 }}
                    spacing={{ base: 8, md: 10 }}
                    py={{ base: 4, md: 6 }}>
                    <Flex>
                        <Image
                            rounded={'md'}
                            alt={'product image'}
                            src={product.image}
                            fit={'cover'}
                            align={'center'}
                            w={'100%'}
                            h={{ base: '100%', sm: '400px', lg: '500px' }}
                        />
                    </Flex>
                    <Stack spacing={{ base: 6, md: 10 }}>
                        <Box as={'header'}>
                            <Heading
                                lineHeight={1.1}
                                fontWeight={600}
                                fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
                                {product.title}
                            </Heading>
                            <Heading as='h5' size='sm' color="gray.500" ps="3">
                                By {product.brand}
                            </Heading>
                            <Text
                                color={useColorModeValue('gray.900', 'gray.400')}
                                fontWeight={300}
                                fontSize={'2xl'}>
                                Rs {product.price}
                            </Text>
                        </Box>

                        <Stack
                            spacing={{ base: 4, sm: 6 }}
                            direction={'column'}
                            divider={
                                <StackDivider
                                    borderColor={useColorModeValue('gray.200', 'gray.600')}
                                />
                            }>

                            <Text fontSize={'lg'}>
                                {product.description}
                            </Text>
                            <Box>
                                <Heading
                                    as='h5' size='sm'
                                    fontSize={{ base: '16px', lg: '18px' }}
                                    color={'gray.500'}
                                    textTransform={'uppercase'}
                                    mb={'4'}>
                                    Product Details
                                </Heading>

                                <List spacing={2}>
                                    <ListItem>
                                        <Text as={'span'} fontWeight={'bold'}>
                                            Warranty:
                                        </Text>{' '}
                                        {product.warrantyPeriod} Months
                                    </ListItem>
                                    <ListItem>
                                        <Text as={'span'} fontWeight={'bold'}>
                                            Category:
                                        </Text>{' '}
                                        {product.category}
                                    </ListItem>
                                    <ListItem>
                                        <Text as={'span'} fontWeight={'bold'}>
                                            Seller:
                                        </Text>{' '}
                                        {product.seller}
                                    </ListItem>
                                </List>
                            </Box>
                        </Stack>
                        <Button
                            onClick={buyNFT}
                            w={['50%', '50%']}
                            mt={8}
                            size={'md'}
                            borderRadius={'15px'}
                            py={'7'}
                            bg={"teal.400"}
                            color={useColorModeValue('white', 'gray.900')}
                            textTransform={'uppercase'}
                            _hover={{
                                transform: 'translateY(2px)',
                                boxShadow: 'lg',
                            }}>
                            Buy Now
                        </Button>
                    </Stack>
                </SimpleGrid>
            </Container>
        </>

    );
}