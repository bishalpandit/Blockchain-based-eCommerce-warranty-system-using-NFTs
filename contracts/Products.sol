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

    // sell nft 
    function sellProduct(
        uint256 itemId
    ) public payable nonReentrant {
        // get product 
        Product storage product = idToProduct[itemId];
        // get price 
        uint256 price = product.price;


        // pay price 
        require(msg.value == price, "Please pay the entire price in order to purchase the product");

        // get last token id and remove it from current product
        uint256  lastTokenId = product.tokenIds[product.tokenIds.length - 1];
        idToProduct[itemId].tokenIds.pop();

        // product.seller.transfer(msg.value); 
        IERC721(product.nftContract).transferFrom(address(product.seller), msg.sender, lastTokenId); 

        // create new product with new item id and set current owner to msg.sender
        _itemIds.increment();
        uint256 newItemId = _itemIds.current();
        Product memory newProduct = Product(
            newItemId,
            product.title,
            product.description,
            product.brand,
            product.category,
            2,
            product.warrantyPeriod,
            product.tokenIds,
            payable(product.seller),
            payable(msg.sender),
            product.nftContract
        );
        idToProduct[newItemId] = newProduct;
        _itemsSold.increment();

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

            // NFT(nftAddress).TransferItem(tokens[i], nftAddress);
            // IERC721(nftAddress).transferFrom(msg.sender, address(this), tokens[i]);
            IERC721(nftAddress).transferFrom(msg.sender, address(this), tokens[i]);
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

