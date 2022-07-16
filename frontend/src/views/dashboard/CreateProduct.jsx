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
import { useState } from 'react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { useFileUpload } from 'use-file-upload';
import axios from 'axios';
import FormData from 'form-data';

const JWT_PINATA = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwN2MyN2U0OC0yMWQ4LTQ2MDMtYmE1Zi0wMTJhY2JjNzgxNDkiLCJlbWFpbCI6ImJpc2hhbHBhbmRpdDE3QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIyNzVjNmEzNWMxYWYyZmQ0NThmNyIsInNjb3BlZEtleVNlY3JldCI6ImVmMWMxMDIxN2JmYzRiMjZhNGE3ZDM2OTZiMmMxM2ZhYWNiNDYxZGQwMDI2YmE4N2E4NzI4N2VlZDllMGFmZjUiLCJpYXQiOjE2NTc4NzQ1NjV9.tN2gByq8cZm9MLfnFCqUA-zStnzkCabP26FOA67iiSs'


export default function CreateProduct() {
  const [featureCount, setFeatureCount] = useState([1]);
  const [file, selectFile] = useFileUpload();

  console.log(file);

  const createProductHandler = async () => {
    //Upload file to IPFS using Pinata
    //Get CID of uploaded file
    //Prepare schema of product with CID as url
    // Use smart contract to deploy in ethereum
    if (!file)
      return;

    const data = new FormData();

    data.append('file', file.file);
    data.append('pinataOptions', '{"cidVersion": 1}');
    data.append('pinataMetadata', '{"name": "MyFile", "keyvalues": {"company": "Pinata"}}');

    const config = {
      method: 'post',
      url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
      headers: {
        'Authorization': `Bearer ${JWT_PINATA}`,
        ...data
      },
      data: data
    };

    const res = await axios(config);
    console.log(res.data);

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
              <Input type="text" />
            </FormControl>
            <FormControl id="brand" isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea />
            </FormControl>
            <FormControl id="brand" isRequired>
              <FormLabel>Brand</FormLabel>
              <Input type="text" />
            </FormControl>
            <FormControl id="category" isRequired>
              <FormLabel>Category</FormLabel>
              <Input type="text" />
            </FormControl>
            <FormControl id="serialNumber" isRequired>
              <FormLabel>Product Serial Number</FormLabel>
              <Input type="text" />
            </FormControl>
            <FormControl id="warranty" isRequired>
              <FormLabel>Warranty Period</FormLabel>
              <Input type="text" />
            </FormControl>
            <FormControl id="warranty" isRequired>
              <FormLabel>Price</FormLabel>
              <Input type="text" />
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
                _hover={{
                  bg: 'teal.500',
                }}>
                Create Product
              </Button>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}