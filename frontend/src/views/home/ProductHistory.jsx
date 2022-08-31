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
import { RiArrowUpCircleFill } from 'react-icons/ri'

import Products from '../../../../artifacts/contracts/Products.sol/Products.json';
import NFT from '../../../../artifacts/contracts/NFT.sol/NFT.json';
import { API_URL, nftAddress, productsAddress } from "../../config";
import Navbar from './Navbar';
import Loader from '../../components/layout/Loader';

function ProductHistory() {
    const { id } = useParams();
    const toast = useToast();
    const navigate = useNavigate();
    const [searchTokenId, setSearchTokenId] = useState('');
    const [productData, setProductData] = useState({
        title: "",
        brand: "",
        price: "",
        category: "",
        warrantyPeriod: "",
        description: "",
        transactionHistory: []
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            loadNFTByTokenId(id);
            getTransactionHistory(id);
            setSearchTokenId(id);
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
                if (response.length)
                    data.push(response[response.length - 1].from)
                setProductData((productData) => { return { ...productData, transactionHistory: data } });

            }).catch(error => console.log(error));
    }

    async function loadNFTByTokenId(id) {
        try {
            const provider = new ethers.providers.JsonRpcBatchProvider(API_URL);
            const productContract = new ethers.Contract(productsAddress, Products.abi, provider);
            const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);

            const product = await productContract.getProductByTokenId(BigNumber.from(id));
            const tokenUri = await tokenContract.tokenURI(product.tokenIds[0]);
            const meta = (await axios.get(tokenUri)).data;
            let price = ethers.utils.formatUnits(product.price.toString(), 'ether');

            const tokens = await Promise.all(product.tokenIds.map(async t => {
                return t.toNumber();
            }));

            setProductData((productData) => {
                return {
                    ...productData,
                    brand: product.brand,
                    title: product.title,
                    category: product.category,
                    warrantyPeriod: product.warrantyPeriod,
                    tokens,
                    price,
                    image: meta.image
                }
            });
            setLoading(false);

        } catch (error) {
            toast({
                description: `Something went Wrong.`,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        }

    }

    const getDetails = () => {
        setLoading(true);
        navigate(`/verify/${searchTokenId}`)
    }

    return (
        <>
            <Navbar />
            <InputGroup size='md' maxWidth='500px' marginTop='50px' marginLeft='auto' marginRight='auto' marginBottom='50px'>
                <Input
                    pr='4.5rem'
                    type='text'
                    onChange={(e) => setSearchTokenId(e.target.value)}
                    value={searchTokenId}
                    placeholder='Enter your token'
                />
                <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='md' onClick={getDetails}>
                        Get
                    </Button>
                </InputRightElement>
            </InputGroup>
            {productData.title === "" ?
                (loading ? <Loader /> : null)
                :
                <Container maxW={'7xl'}>
                    <SimpleGrid
                        columns={{ base: 1, lg: 2 }}
                        spacing={{ base: 8, md: 10 }}
                        py={{ base: 4, md: 6 }}>
                        <Flex>
                        <Box w="100%" h="270px" style={{ alignItems: 'center' }}>
                            <Image
                                rounded={'md'}
                                alt={'product image'}
                                src={productData.image}
                            />
                            </Box>
                        </Flex>
                        <Stack spacing={{ base: 6, md: 10 }}>
                            <Box as={'header'}>
                                <Heading
                                    lineHeight={1.1}
                                    fontWeight={600}
                                    fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
                                    {productData.title}
                                </Heading>
                                <Heading as='h5' size='sm' color="gray.500" ps="3">
                                    By {productData.brand}
                                </Heading>
                                <Text
                                    color={useColorModeValue('gray.900', 'gray.400')}
                                    fontWeight={300}
                                    fontSize={'2xl'}>
                                    Rs {productData.price}
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
                                    {productData.description}
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
                                            {productData.warrantyPeriod} Months
                                        </ListItem>
                                        <ListItem>
                                            <Text as={'span'} fontWeight={'bold'}>
                                                Category:
                                            </Text>{' '}
                                            {productData.category}
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
                                        as='h5' size='sm' return
                                        fontSize={{ base: '16px', lg: '18px' }}
                                        color={'gray.500'}
                                        textTransform={'uppercase'}
                                        mb={'4'}>
                                        Transaction history
                                    </Heading>
                                    <Box _before={{ content: '""', position: 'absolute', width: '8px', height: '100%', backgroundColor: 'var(--chakra-colors-green-100)' }} position='relative' paddingLeft='50px'  >
                                        {
                                            productData.transactionHistory.map((id) => (
                                                <List spacing={2} display='flex' alignItems='center' marginBottom='10px' marginTop='10px'>
                                                    <RiArrowUpCircleFill style={{ position: 'relative', left: '4px', transform: 'translateX(-50%)', width: '25px', height: '25px', color: 'var(--chakra-colors-teal-500)' }} />
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
            }
        </>

    );
}

export default ProductHistory