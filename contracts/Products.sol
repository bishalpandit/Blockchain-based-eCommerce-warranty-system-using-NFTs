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
        //require(price > 0, "Price must be at least 1 wei");
        //require(msg.value > 0, "Price must be equal to listing Price");

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
    function sellProduct(uint256 itemId) public payable nonReentrant {
        // get product
        Product storage product = idToProduct[itemId];
        // get price
        uint256 price = product.price;

        // pay price
        require(
            msg.value == price,
            "Please pay the entire price in order to purchase the product"
        );

        // get last token id and remove it from current product
        uint256 lastTokenId = product.tokenIds[product.tokenIds.length - 1];
        idToProduct[itemId].tokenIds.pop();

       uint256[] memory buyerTokens = new uint256[](1);

       buyerTokens[0] = lastTokenId;

        // product.seller.transfer(msg.value);
        IERC721(product.nftContract).transferFrom(
            address(this),
            msg.sender,
            lastTokenId
        );

        // create new product with new item id and set current owner to msg.sender
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
            buyerTokens,
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

    function getMyProducts() public view returns (Product[] memory) {
        uint totalProductCount = _itemIds.current();
        uint myProductCount = 0;
        uint currentIndex = 0;

        for (uint i=0; i < totalProductCount; i++) {
            if (idToProduct[i+1].owner == msg.sender) {
                myProductCount += 1;
            }
        }

        Product[] memory myProducts = new Product[](myProductCount);

        for (uint i = 0; i < totalProductCount; i++) {
            if (idToProduct[i+1].owner == msg.sender) {
                uint currentId = idToProduct[i+1].itemId; 
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
        uint256 lastTokenId = idToProduct[itemId].tokenIds[idToProduct[itemId].tokenIds.length - 1];
        return lastTokenId;
    } 
}
