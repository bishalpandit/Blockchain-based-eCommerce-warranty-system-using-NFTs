// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";
import "./NFT.sol";

contract Products is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;

    address payable owner;

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
        uint256 warrantyEndDate;
        uint256[] tokenIds;
        address payable seller;
        address payable owner;
        address nftContract;
    }
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

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
            0,
            generateTokens(nftAddress, tokenURI, serialNos),
            payable(msg.sender),
            payable(address(0)),
            nftAddress
        );
    }

    function buyProduct(uint256 itemId) public payable nonReentrant {
        Product storage product = idToProduct[itemId];
        uint256 price = product.price;

        require(
            msg.value == price,
            "Please pay the entire price in order to purchase the product"
        );
        require(
            product.tokenIds.length > 0,
            "Product out of stock"
        );
        require(
            msg.sender != product.seller,
            "Seller cannot buy their own product"
        );

        uint256 lastTokenId = product.tokenIds[product.tokenIds.length - 1];
        idToProduct[itemId].tokenIds.pop();

        uint256[] memory buyerTokens = new uint256[](1);
        buyerTokens[0] = lastTokenId;

        uint256 warrantyEndDate = block.timestamp + (uint256(product.warrantyPeriod) * 30 * 24 * 60 * 60);

        IERC721(product.nftContract).transferFrom(
            address(this),
            msg.sender,
            lastTokenId
        );

        _itemIds.increment();
        uint256 newItemId = _itemIds.current();

        Product memory newProduct = Product(
            newItemId,
            product.title,
            product.description,
            product.brand,
            product.category,
            product.price,
            product.warrantyPeriod,
            warrantyEndDate,
            buyerTokens,
            payable(product.seller),
            payable(msg.sender),
            product.nftContract
        );
        
        idToProduct[newItemId] = newProduct;
        emit Transfer(product.seller, msg.sender, lastTokenId);

    }

    function generateTokens(
        address nftAddress,
        string memory tokenURI,
        uint256[] memory serialNos
    ) private returns (uint256[] memory) {
        uint256[] memory tokens = new uint256[](serialNos.length);

        for (uint8 i = 0; i < serialNos.length; i++) {
            tokens[i] = NFT(nftAddress).createToken(tokenURI, serialNos[i]);
        }

        return tokens;
    }

    function getProducts() public view returns (Product[] memory) {
        uint256 itemsCount = _itemIds.current();
        uint256 unsoldItemsCount = 0;

        for(uint256 i=1; i<=itemsCount; i++) {
            if(idToProduct[i].owner == address(0)) {
                unsoldItemsCount++;
            }
        }
        Product[] memory items = new Product[](unsoldItemsCount);

        uint256 index = 0;
        for (uint256 i = 1; i <= itemsCount; i++) {
            if(idToProduct[i].owner == address(0)) {
                items[index] = idToProduct[i];
                index++;
            }
        }

        return items;
    }

    function getProductById(uint256 itemId) public view returns (Product memory) {
        uint256 itemsCount = _itemIds.current();
        require(itemsCount >= itemId, "Invalid itemd id");
        return idToProduct[itemId];
    }

    function getMyProducts() public view returns (Product[] memory) {
        uint256 totalProductCount = _itemIds.current();
        uint256 myProductCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalProductCount; i++) {
            if (idToProduct[i + 1].owner == msg.sender) {
                myProductCount += 1;
            }
        }

        Product[] memory myProducts = new Product[](myProductCount);

        for (uint256 i = 0; i < totalProductCount; i++) {
            if (idToProduct[i + 1].owner == msg.sender) {
                uint256 currentId = idToProduct[i + 1].itemId;
                Product storage currentItem = idToProduct[currentId];
                myProducts[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return myProducts;
    }

    function getTokenOwner(uint256 tokenId, address nftContract)
        public
        view
        returns (address)
    {
        return NFT(nftContract).getTokenOwner(tokenId);
    }

    function getBuyerAddress() public view returns (address) {
        return msg.sender;
    }

    function getLastToken(uint256 itemId) public view returns (uint256) {
        uint256 lastTokenId = idToProduct[itemId].tokenIds[
            idToProduct[itemId].tokenIds.length - 1
        ];
        return lastTokenId;
    } 

    function transferProduct(uint256 itemId, address payable receiver) public payable nonReentrant {
        Product storage product = idToProduct[itemId];
        require(
            msg.sender == product.owner && 
            msg.sender == NFT(product.nftContract).getTokenOwner(product.tokenIds[0]),
            "You are not the owner or seller of this product"
        );
       
        uint256 lastTokenId = product.tokenIds[product.tokenIds.length - 1];

        IERC721(product.nftContract).transferFrom(
            msg.sender,
            receiver,
            lastTokenId
        );

        idToProduct[itemId].owner = receiver;
         emit Transfer(msg.sender, receiver, lastTokenId);
    }
}
