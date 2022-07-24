// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9; 

import '@openzeppelin/contracts/token/ERC721/ERC721.sol'; 
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol'; 
import "@openzeppelin/contracts/utils/Counters.sol";


contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter; 
    //Counters.Counter private _tokenIds; 
    address contractAddress; 

    constructor(address ProductsAddress) ERC721("Metaverse Tokens", "MeTT") {
        contractAddress = ProductsAddress;
    }

    function createToken(string memory tokenURI, uint256 serialNo) external returns (uint) {
        uint256 tokenId = serialNo;
        _mint(msg.sender, tokenId);
         _setTokenURI(tokenId, tokenURI);
        //  if (isApprovedForAll(msg.sender, contractAddress)) {
        //     setApprovalForAll(msg.sender, true);
        // }
        return tokenId;
    }


    // function TransferItem(uint256 tokenId, address nftAddress) external {
    //     IERC721(nftAddress).transferFrom(msg.sender, contractAddress, tokenId);

    // }
} 