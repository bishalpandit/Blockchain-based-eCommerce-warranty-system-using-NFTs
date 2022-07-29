import React from "react";
import ProductDetails from "./ProductDetails";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Card from "../../components/Card";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";


import Index from "./Index";
import ProductHistory from "./ProductHistory";

function HomeRoutes() {
  return (
    <Routes>
      <Route path="/product/*">
        <Route path=":id" element={<ProductDetails />} />
      </Route>
      <Route path="/verify/*">
      <Route path="/:id" element={<ProductHistory />} />
      </Route>
      <Route path="/" element={<Index />} />
    </Routes>
  );
}


export default HomeRoutes;
