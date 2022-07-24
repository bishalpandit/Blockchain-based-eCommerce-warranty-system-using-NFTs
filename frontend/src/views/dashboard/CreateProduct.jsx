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
  Textarea,
  IconButton,
  Image
} from '@chakra-ui/react';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useState } from 'react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { useFileUpload } from 'use-file-upload';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { useForm } from "react-hook-form";
import NFT from '../../../../artifacts/contracts/NFT.sol/NFT.json';
import Products from '../../../../artifacts/contracts/Products.sol/Products.json';
import { nftAddress, productsAddress } from "../../config";
import axios from 'axios'

const baseDataURL = `https://ipfs.infura.io/ipfs/`

const client = ipfsHttpClient(`https://ipfs.infura.io:5001/api/v0`)

export default function CreateProduct() {
  const [indexes, setIndexes] = useState([]);
  const [counter, setCounter] = useState(0);
  const { register, handleSubmit } = useForm();
  const [file, selectFile] = useFileUpload();

  const formSubmit = async (data) => {
    if (!file) return;
    try {
      const added = await client.add(file.file);
      const url = `${baseDataURL}${added.path}`;
      generateTokenURI(url, data);
    } catch (e) {
      console.log(e);
    }
  }

  async function generateTokenURI(fileUrl, data) {
    const { title, description, price } = data;

    if (!title || !description || !price || !fileUrl) return; 
    const requestData = JSON.stringify({ 
      title, description, image: fileUrl
    });

    try {
      const added = await client.add(requestData); 
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      createProduct(url, data);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }


  async function createProduct(tokenURI, data) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const { title, description, brand, category, warranty, serials } = data;

    serials.forEach((item, idx) => {
      serials[idx] = parseInt(item);
    })

    const price = ethers.utils.parseUnits(data.price, 'ether');

    const productsContract = new ethers.Contract(productsAddress, Products.abi, signer);
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);

    const tx = await productsContract.createProduct(
      title,
      description,
      brand,
      category,
      price,
      warranty,
      serials,
      nftAddress,
      tokenURI,
    );

    await tx.wait();

    const productsData = await productsContract.getProducts();

    const products = await Promise.all(productsData.map(async p => {
      const tokenUri = await tokenContract.tokenURI(p.tokenIds[0]); 
      const meta = await axios.get(tokenUri);
      let price = ethers.utils.formatUnits(p.price.toString(), 'ether');  
      const { title, description, brand, category, warrantyPeriod, tokenIds, seller, owner } = p;

      const tokens = await Promise.all(tokenIds.map(async t => {
        return t.toNumber();
      }))

      let item = { 
        title,
        description,
        brand,
        category,
        price,
        warrantyPeriod,
        tokens,
        seller,
        owner,
        image: meta.data.image
      };

      return item;
    }));

    console.log(products);

  }


  const addSerial = () => {
    setIndexes(prevIndexes => [...prevIndexes, counter]);
    setCounter(prevCounter => prevCounter + 1);
  };

  const removeSerial = index => () => {
    setIndexes(prevIndexes => [...prevIndexes.filter(item => item !== index)]);
    setCounter(prevCounter => prevCounter - 1);
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
    >
      <Stack spacing={8} mx={'auto'} w={'full'} pb={12} px={6}>
        <Box
          p={8}>
          <form onSubmit={handleSubmit(formSubmit)}>
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
                <Input type="text" {...register("title")} />
              </FormControl>
              <FormControl id="description" isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea  {...register("description")} />
              </FormControl>
              <FormControl id="brand" isRequired>
                <FormLabel>Brand</FormLabel>
                <Input type="text"   {...register("brand")} />
              </FormControl>
              <FormControl id="category" isRequired>
                <FormLabel>Category</FormLabel>
                <Input type="text"   {...register("category")} />
              </FormControl>
              <FormControl id="warranty" isRequired>
                <FormLabel>Warranty Period(in months)</FormLabel>
                <Input type="text"  {...register("warranty")} />
              </FormControl>
              <FormControl id="price" isRequired>
                <FormLabel>Price</FormLabel>
                <Input type="text" {...register("price")} />
              </FormControl>
              <Stack textAlign={'start'} spacing={4}>
                <Text fontSize={'lg'}>Product Serial Nos.</Text>
                {
                  indexes.map(index =>
                    <HStack spacing={4} key={index}>
                      <FormControl id="serial" >
                        <FormLabel>Serial No. {index + 1}</FormLabel>
                        <Input
                          type="text"
                          name={`serials[${index}]`}
                          {...register(`serials[${index}]`)}
                        />
                      </FormControl>
                      <IconButton
                        w={'50px'}
                        colorScheme='teal'
                        aria-label='Add feature'
                        icon={<MinusIcon />}
                        onClick={removeSerial(index)}
                      />
                    </HStack>
                  )
                }
                <HStack spacing={4}>
                  <IconButton
                    w={'50px'}
                    colorScheme='teal'
                    aria-label='Add feature'
                    icon={<AddIcon />}
                    onClick={addSerial}
                  />
                </HStack>
              </Stack>
              <Box>
                <Button
                  onClick={formSubmit}
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