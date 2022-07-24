import {
  Flex,
  Circle,
  Box,
  Image,
  Badge,
  useColorModeValue,
  Icon,
  chakra,
  Tooltip
} from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { nftAddress, productsAddress } from "../config";

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

function Card({ itemId, image, title, price, description, tokenIds }) {

  // buying nft
  async function buyNFT(itemId, price) {
    const web3Modal = new Web3Modal(); 
    const connection = await web3Modal.connect(); 
    const provider = new ethers.providers.Web3Provider(connection); 

    const signer = provider.getSigner(); 
    const contract = new ethers.Contract(productsAddress, Products.abi, signer); 
    const newPrice = ethers.utils.parseUnits(price.toString(), "ether");
    const transaction = await contract.sellProduct(itemId, {
      value: newPrice
    });

    await transaction.wait(); 
  }

  return (
    <Box
      bg={useColorModeValue("white", "gray.800")}
      maxW="sm"
      borderWidth="1px"
      rounded="lg"
      shadow="lg"
      position="relative"
    >
      <Image src={image} alt={`Picture of ${title}`} roundedTop="lg" />

      <Box p="6">
        <Box d="flex" alignItems="baseline" />
        <Flex mt="1" justifyContent="space-between" alignContent="center">
          <Box fontSize="2xl" fontWeight="semibold" as="h4" lineHeight="tight">
            {title}
          </Box>
          <Tooltip
            label="Add to cart"
            bg="white"
            placement={"top"}
            color={"gray.800"}
            fontSize={"1.2em"}
          >
            <chakra.a href={"#"} display={"flex"}>
              <Icon
                as={FiShoppingCart}
                h={7}
                w={7}
                alignSelf={"center"}
                onClick={() => buyNFT(itemId, price)}
              />
            </chakra.a>
          </Tooltip>
        </Flex>
        <Text fontSize="xl">
          {description}
        </Text>
        <Flex justifyContent="space-between" alignContent="center">
          <Rating rating={5} numReviews={22} />
          <Box fontSize="2xl" color={useColorModeValue("gray.800", "white")}>
            <Box as="span" color={"gray.600"} fontSize="lg">
              ₹
            </Box>
            {price}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export default Card;
