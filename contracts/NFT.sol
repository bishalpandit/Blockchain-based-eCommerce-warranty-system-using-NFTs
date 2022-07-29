// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9; 

import '@openzeppelin/contracts/token/ERC721/ERC721.sol'; 
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol'; 
import "@openzeppelin/contracts/utils/Counters.sol";


contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter; 
    address contractAddress; 

    constructor(address ProductsAddress) ERC721("NFT Tokens", "NFT") {
        contractAddress = ProductsAddress;
    }

    function createToken(string memory tokenURI, uint256 serialNo) external returns (uint) {
        uint256 tokenId = serialNo;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        return tokenId;
    }

    function getTokenOwner(uint256 tokenId) external view returns (address) {
        return ownerOf(tokenId);
    }

     function giveOwnershipToContract() external   {
         setApprovalForAll(contractAddress, true);
    }
    
    function transferNFT(address payable sender, address payable receiver, uint256 tokenId) external {
        _transfer(sender, receiver, tokenId);
    }

    function burnToken(uint256 tokenId) external {
        _burn(tokenId);
    }

} 