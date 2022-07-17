const { expect } = require("chai");

describe('NFTMarket', () => { 
  it("Should create and execute market sales", async function() {
    const Market = await ethers.getContractFactory("NFTMarket"); //get nftMarket 
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    const NFT = await ethers.getContractFactory("NFT") // get nft
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;

    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('100', 'ether'); // in how much amount we want to sell
    await nft.createToken("https://www.mytokenlocation.com")
    await nft.createToken("https://www.mytokenlocation2.com")

    await market.createMarketItem(nftContractAddress, 1, auctionPrice, {value: listingPrice})
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, {value: listingPrice})

    const [_, buyerAddress] = await ethers.getSigners();

    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, {value: auctionPrice})

    let items = await market.fetchMarketItems()
    let myItems = await market.connect(buyerAddress).fetchMyNFTs()
    items = await Promise.all(items.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId)
      let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller, 
        owner: i.owner,
        tokenUri
      }
      return item 
    }))
    console.log("items:", items);
    myItems = await Promise.all(myItems.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId)
      let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller, 
        owner: i.owner,
        tokenUri
      }
      return item 
    }))
    console.log("my items:", myItems);

  });
 });
 
