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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Portal,
  Button,
  Input,
  Stack,
  HStack,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalContent
} from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { API_URL, nftAddress, productsAddress } from "../config";
import { MdContentCopy } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { FiSend } from "react-icons/fi";

import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json";
import Products from "../../../artifacts/contracts/Products.sol/Products.json";

const data = {
  isNew: true,
  imageURL:
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=4600&q=80",
  name: "Wayfarer Classic",
  price: 4.5,
  rating: 4.2,
  numReviews: 34
};

function Rating({ rating, numReviews }) {
  return (
    <Box d="flex" alignItems="center">
      {Array(5).fill("").map((_, i) => {
        const roundedRating = Math.round(rating * 2) / 2;
        if (roundedRating - i >= 1) {
          return (
            <BsStarFill
              key={i}
              style={{ marginLeft: "1" }}
              color={i < rating ? "teal.500" : "gray.300"}
            />
          );
        }
        if (roundedRating - i === 0.5) {
          return <BsStarHalf key={i} style={{ marginLeft: "1" }} />;
        }
        return <BsStar key={i} style={{ marginLeft: "1" }} />;
      })}
      <Box as="span" ml="2" color="gray.600" fontSize="sm">
        {numReviews} review{numReviews > 1 && "s"}
      </Box>
    </Box>
  );
}

function Card({ itemId, image, title, price, description, tokenIds, owner }) {
  const toast = useToast();
  const [receiverAddress, setReceiverAddress] = useState('');

  console.log(itemId);

  const { isOpen, onOpen, onClose } = useDisclosure();
  // buying nft
  async function buyNFT(itemId, price) {

    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      const signer = provider.getSigner();
      const contract = new ethers.Contract(productsAddress, Products.abi, signer);
      const newPrice = ethers.utils.parseUnits(price.toString(), "ether");
      const transaction = await contract.buyProduct(itemId, {
        value: newPrice
      });

      await transaction.wait();

      toast({
        title: "Success",
        description: `${title} purchased`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      toast({
        title: "Failure",
        description: err,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }

  }

  async function transferProduct() {

    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      const signer = provider.getSigner();
      const contract = new ethers.Contract(productsAddress, Products.abi, signer);
      const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
      
      // await tokenContract.giveOwnershipToContract();
      const transaction = await contract.transferProduct(itemId, receiverAddress);

      await transaction.wait();
      console.log(transaction + 'hi');

      toast({
        title: "Success",
        description: `${title} transferred`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      toast({
        title: "Failure",
        description: "Error occured. Check console for more info.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  }

  async function getOwner() {
    const provider = new ethers.providers.JsonRpcBatchProvider(API_URL);
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const productsContract = new ethers.Contract(productsAddress, Products.abi, provider);

    const data = await productsContract.getTokenOwner(1234, nftAddress);
    console.log(data);
  }

  return (
    <Box
      bg={useColorModeValue("white", "gray.800")}
      w="300px"
      h="450px"
      borderWidth="1px"
      rounded="lg"
      shadow="lg"
      position="relative"
    >
      <Box w="100%" h="270px" style={{display: 'flex', alignItems: 'center'}}>
        <Image
          src={image}
          alt={`Picture of ${title}`}
          roundedTop="lg"
          borderRadius="base"
        />
      </Box>

      <Box p="6">
        <Box d="flex" alignItems="baseline">
          <Badge rounded="full" px="2" fontSize="0.8em">
            <HStack spacing={2}>
              <MdContentCopy />
              <Text>
                {tokenIds.length}
              </Text>
            </HStack>
          </Badge>
        </Box>
        <Box d="flex" alignItems="baseline" />
        <Flex mt="1" justifyContent="space-between" alignContent="center">
          <Box fontSize="2xl" fontWeight="semibold" as="h4" lineHeight="tight">
            {title}
          </Box>
          <Tooltip
            label={parseInt(owner) == 0 ? "Buy" : "Transfer Product"}
            bg="white"
            placement={"top"}
            color={"gray.800"}
            fontSize={"1.2em"}
          >
            <chakra.a href={"#"} display={"flex"}>
              <Button onClick={onOpen}>
                <Icon
                  as={parseInt(owner) == 0 ? FiShoppingCart : FiSend}
                  h={7}
                  w={7}
                  alignSelf={"center"}
                  onClick={
                    parseInt(owner) == 0 ? () => buyNFT(itemId, price) : null
                  }
                />
              </Button>
              <Modal
                blockScrollOnMount={false}
                isOpen={isOpen}
                onClose={onClose}
                isCentered
              >
                <ModalOverlay
                  bg="blackAlpha.300"
                  backdropFilter="blur(10px) hue-rotate(90deg)"
                />
                <ModalContent>
                  <ModalHeader>
                    Transfer {title}
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Stack spacing={2}>
                      <Input onChange={(e) => setReceiverAddress(e.target.value)} placeholder="Receiver's Address" />
                    </Stack>
                  </ModalBody>

                  <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={() => { transferProduct(); onClose(); }}>
                      Transfer
                    </Button>
                    <Button variant="ghost">Cancel</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              {/* <Popover>
                <PopoverTrigger>
                  <Icon
                    as={parseInt(owner) == 0 ? FiShoppingCart : IoMdSend}
                    h={7}
                    w={7}
                    alignSelf={"center"}
                    onClick={parseInt(owner) == 0 ? () => buyNFT(itemId, price) : null}
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverHeader>Transfer Product</PopoverHeader>
                  <PopoverCloseButton />
                  <PopoverBody>
                    <Stack spacing={2}>
                      <Input onChange={(e) => setReceiverAddress(e.target.value)} placeholder="Reciever's Address" />
                      <Button onClick={transferProduct}  colorScheme='blue'>Transfer</Button>
                    </Stack>
                  </PopoverBody>
                </PopoverContent>
              </Popover> */}
            </chakra.a>
          </Tooltip>
        </Flex>
        <Flex justifyContent="space-between" alignContent="center">
          <Box fontSize="2xl" color={useColorModeValue("gray.800", "white")}>
            <Box as="span" py={2} color={"gray.600"} fontSize="lg">
              {parseInt(owner) == 0
                ? price + "ETH"
                : price + "ETH | months left"}
            </Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export default Card;
