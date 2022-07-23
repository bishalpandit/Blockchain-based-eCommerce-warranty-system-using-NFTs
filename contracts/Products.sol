// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./NFT.sol";

contract Products is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    address payable owner;
    uint256 listingPrice = 0.025 ether;

    constructor() {
        owner = payable(msg.sender);
    }

    struct Product {
        uint256 itemId;
        string title;
        string description;
        string brand;
        string category;
        uint256 price;
        uint8 warrantyPeriod;
        uint256[] tokenIds;
        address payable seller;
        address payable owner;
        address nftContract;
    }


    mapping(uint256 => Product) private idToProduct;

    function createProduct(
        string memory title,
        string memory description,
        string memory brand,
        string memory category,
        uint256 price,
        uint8 warrantyPeriod,
        uint256[] memory serialNos,
        address nftAddress,
        string memory tokenURI
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");


        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToProduct[itemId] = Product(
            itemId,
            title,
            description,
            brand,
            category,
            price,
            warrantyPeriod,
            generateTokens(nftAddress, tokenURI, serialNos),
            payable(msg.sender),
            payable(address(0)),
            nftAddress
        );

    }

    function generateTokens(
        address nftAddress,
        string memory tokenURI,
        uint256[] memory serialNos
    ) private returns (uint256[] memory) {
        uint256[] memory tokens = new uint256[](serialNos.length);

        for (uint8 i = 0; i < serialNos.length; i++) {
            tokens[i] = NFT(nftAddress).createToken(
                tokenURI,
                serialNos[i]
            );
        }

        return tokens;
    }

    function fetchProducts() public view returns (Product[] memory) {
        uint itemsCount = _itemIds.current();

        Product[] memory items = new Product[](_itemIds.current());

        for(uint i = 1; i <= itemsCount; i++) {
            items[i - 1] = idToProduct[i]; 
        }
  
        return items;
    }
}

