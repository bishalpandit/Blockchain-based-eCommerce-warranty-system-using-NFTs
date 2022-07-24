import React from "react";
import ProductDetails from "./ProductDetails";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Card from "../../components/Card";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { nftAddress, nftMarketAddress } from "../../config";

import NFT from "../../../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

import Index from "./Index";

function HomeRoutes() {
  return (
    <Routes>
      <Route path="/product" element={<ProductDetails />} />
      <Route path="/" element={<Index />} />
    </Routes>
  );
}

export default HomeRoutes;
