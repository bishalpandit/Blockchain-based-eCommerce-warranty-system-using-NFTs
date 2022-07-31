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
    ChakraProvider,
    useToast,
    Badge,
    Input,
    InputRightElement, 
    InputGroup
} from '@chakra-ui/react';
import Web3Modal from 'web3modal';
import { BigNumber, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {RiArrowUpCircleFill} from 'react-icons/ri'

import Products from '../../../../artifacts/contracts/Products.sol/Products.json';
import NFT from '../../../../artifacts/contracts/NFT.sol/NFT.json';
import { API_URL, nftAddress, productsAddress } from "../../config";
import Navbar from './Navbar';
import Loader from '../../components/layout/Loader';

function ProductHistory() {
    const { id } = useParams();
    const toast = useToast();
    const navigate = useNavigate();
    const transactions = [
        1223333,
        6454545,
        "sdfsfsdsf",
        
    ]

    const [tokenId, setTokenId] = useState('');
    const [product, setProduct] = useState({
        title: "apple Watch",
        brand: "apple",
        price: "51",
        category: "watch",
        warrantyPeriod: "6Month",
        description: "coolest watch you ever need....",
        transactionHistory: []
    });

    useEffect(() => {
        if (id) {
            loadNFTByTokenId(id);
            getTransactionHistory(id);
        }
    }, [id]);


    async function getTransactionHistory(id) {
        let data = JSON.stringify({
            "jsonrpc": "2.0",
            "id": id,
            "method": "alchemy_getAssetTransfers",
            "params": [
                {
                    "fromBlock": "0x0",
                    "fromAddress": "0xaE16f167ecf93b2c729952D2c03c8141137aB945",
                    "category": ["erc721"]
                }
            ]
        });

        var requestOptions = {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            data: data,
        };




        axios(API_URL, requestOptions)
            .then(res => {
                const response = res?.data?.result?.transfers || []
                const data = response.map((transaction) => transaction.to);
                if(response.length)
                data.push(transactions[ transactions.length -1 ].from)
                setProduct({ ...product, transactionHistory: data })
            }).catch(error => console.log(error));
    }

    async function loadNFTByTokenId(id) {
        try {
            const provider = new ethers.providers.JsonRpcBatchProvider(API_URL);
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
        } catch (error) {
            toast({

            })
        }

    }

    const getDetails = () => {
        navigate(`/verify/${tokenId}`)
    }

    if (!product)
        return <Loader />

    return (
        <>
            <Navbar />
            <InputGroup size='md' maxWidth='500px' marginTop='50px' marginLeft='auto' marginRight='auto' marginBottom='50px'>
      <Input
        pr='4.5rem'
        type='text'
        onChange={(e) => setTokenId(e.target.value)}
        placeholder='Enter your token'
      />
      <InputRightElement width='4.5rem'>
        <Button h='1.75rem' size='md' onClick={getDetails}>
            Get
        </Button>
      </InputRightElement>
    </InputGroup>
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
                                    {/* <ListItem>
                                        <Text as={'span'} fontWeight={'bold'}>
                                            Seller:
                                        </Text>{' '}
                                        {product.seller}
                                    </ListItem> */}
                                </List>
                            </Box>
                            <Box>
                                <Heading
                                    as='h5' size='sm'
                                    fontSize={{ base: '16px', lg: '18px' }}
                                    color={'gray.500'}
                                    textTransform={'uppercase'}
                                    mb={'4'}>
                                    Transaction history
                                </Heading>
                                    <Box _before={{content: '""', position: 'absolute', width: '8px', height: '100%', backgroundColor: 'var(--chakra-colors-green-100)'}} position='relative'  paddingLeft='50px'  >
                                          {
                                        data.map((id) => (
                                            <List spacing={2} display='flex' alignItems='center' marginBottom='10px' marginTop='10px'>
                                            <RiArrowUpCircleFill style={{position:'relative', left:'4px', transform: 'translateX(-50%)', width:'25px', height: '25px',  color: 'var(--chakra-colors-teal-500)'}}/>
                                            <Badge as={'p'} fontWeight={'bold'} marginTop='0px !important' marginLeft='5px' padding='2px' colorScheme='green'>
                                                {id}
                                            </Badge>
                                        </List>
                                        ))
                                    }
                                    </Box> 
                                    {/* <Box  backgroundColor='gainsboro' paddingLeft='50px' >
                                          {
                                        transactions.map((id) => (
                                            <List spacing={2} display='flex' alignItems='center' borderLeft='2px solid black' >
                                            <RiArrowUpCircleFill style={{position:'relative', left:'-1px', transform: 'translateX(-50%)', width:'25px', height: '25px'}}/>
                                            <Text as={'p'} fontWeight={'bold'} marginTop='0px !important' marginLeft='5px'>
                                                {id}
                                            </Text>
                                        </List>
                                        ))
                                    }
                                    </Box> */}
                                  
                                {/* {
                                    product.transactionHistory.map((transaction) => (
                                        <List spacing={2}>
                                            <Text as={'p'} fontWeight={'bold'}>
                                                {transaction.to}
                                            </Text>
                                        </List>
                                    ))
                                } */}

                                {/* <List spacing={2}>
                                    <Text as={'p'} fontWeight={'bold'}>
                                        {product.transactionHistory?.[0]?.from}
                                    </Text>
                                </List> */}

                            </Box>
                        </Stack>
                    </Stack>
                </SimpleGrid>
            </Container>
        </>

    );
}

export default ProductHistory