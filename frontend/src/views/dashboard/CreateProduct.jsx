import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Textarea,
  IconButton,
  Image
} from '@chakra-ui/react';
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useState } from 'react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { useFileUpload } from 'use-file-upload';
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import { useForm } from "react-hook-form";
import NFT from '../../../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import { nftAddress, nftMarketAddress } from "../../config";

const baseDataURL = `https://ipfs.infura.io/ipfs/`

const client = ipfsHttpClient(`https://ipfs.infura.io:5001/api/v0`)

export default function CreateProduct() {
  const [featureCount, setFeatureCount] = useState([1]);
  const { register, handleSubmit } = useForm();
  const [file, selectFile] = useFileUpload();

  console.log(file);

  // create and save to ipfs 
  async function createItem(fileUrl, data) {
    const {title, description, price } = data;
    if (!title || !description  || !price || !fileUrl) return; // form validation
    const requestData = JSON.stringify({ // stringify 
      title, description, image: fileUrl
    })

    try {
      const added = await client.add(requestData); //save to ipfs name description and image url in ipfs 
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      createSale(url, price)
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  // creating nft 
  async function createSale(url, price) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner()

    let contract = new ethers.Contract(nftAddress, NFT.abi, signer)
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait()
    console.log(tx);
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()

    const newPrice = ethers.utils.parseUnits(price, 'ether')

    contract = new ethers.Contract(nftMarketAddress, Market.abi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString()

    transaction = await contract.createMarketItem(
      nftAddress, tokenId, newPrice, { value: listingPrice }
    )

    await transaction.wait()
  }

  const createProductHandler = async (data) => {
    if (!file)
      return;
    try {
      const added = await client.add(
        file.file,
      )
      const url = `${baseDataURL}${added.path}`
      createItem(url, data);
    } catch (e) {
      console.log(e)
    }

  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
    >
      <Stack spacing={8} mx={'auto'} w={'full'} pb={12} px={6}>
        <Box
          p={8}>
          <form onSubmit={handleSubmit(createProductHandler)}>
          <Stack maxW={'lg'} mx={'auto'} textAlign={'center'} spacing={4}>
            <Stack spacing={8}>
              <Heading textAlign={"start"} size={"lg"}>Upload Product Image</Heading>
              <Image
                src={file?.source}
                fallbackSrc={"https://via.placeholder.com/230x150.png/404040/FFFFFF?text=Upload + Image"}
                maxW={"xs"}
                alt='Upload preview'
                rounded={"2xl"}
              />
              <IconButton
                colorScheme='teal'
                aria-label='Add File'
                icon={<AddIcon />}
                w={4}
                onClick={() => {
                  selectFile({ accept: 'image/*' }, ({ source, name, size, file }) => {
                  })
                }}
              />
            </Stack>
            <FormControl id="productTitle" isRequired>
              <FormLabel>Product Title</FormLabel>
              <Input type="text" {...register("title")}/>
            </FormControl>
            <FormControl id="description" isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea  {...register("description")}/>
            </FormControl>
            <FormControl id="brand" isRequired>
              <FormLabel>Brand</FormLabel>
              <Input type="text"   {...register("brand")}/>
            </FormControl>
            <FormControl id="category" isRequired>
              <FormLabel>Category</FormLabel>
              <Input type="text"   {...register("category")}/>
            </FormControl>
            <FormControl id="serialNumber" isRequired>
              <FormLabel>Product Serial Number</FormLabel>
              <Input type="text"  {...register("serialNumber")}/>
            </FormControl>
            <FormControl id="warranty" isRequired>
              <FormLabel>Warranty Period</FormLabel>
              <Input type="text"  {...register("warranty")} />
            </FormControl>
            <FormControl id="price" isRequired>
              <FormLabel>Price</FormLabel>
              <Input type="text" {...register("price")}  />
            </FormControl>
            <Stack textAlign={'start'} spacing={4}>
              <Text fontSize={'lg'}>Features</Text>
              {
                featureCount.map((_, idx) =>
                  <HStack key={idx} spacing={4}>
                    <FormControl id="warranty" >
                      <FormLabel>Feature Name</FormLabel>
                      <Input type="text" />
                    </FormControl>
                    <FormControl id="warranty" >
                      <FormLabel>Value</FormLabel>
                      <Input type="text" />
                    </FormControl>
                  </HStack>
                )
              }
              <HStack spacing={4}>
                <IconButton
                  w={'50px'}
                  colorScheme='teal'
                  aria-label='Add feature'
                  icon={<AddIcon />}
                  onClick={() => setFeatureCount((prev) => { return [...prev, prev + 1] })}
                />
                <IconButton
                  w={'50px'}
                  colorScheme='teal'
                  aria-label='Add feature'
                  icon={<MinusIcon />}
                  onClick={() => setFeatureCount((prev) => { prev.pop(); return [...prev]; })}
                />
              </HStack>
            </Stack>
            <Box>
              <Button
                onClick={createProductHandler}
                disabled={!file}
                w={'xss'}
                bg={'teal.400'}
                color={'white'}
                type="submit" 
                _hover={{
                  bg: 'teal.500',
                }}>
                Create Product
              </Button>
            </Box>
          </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}