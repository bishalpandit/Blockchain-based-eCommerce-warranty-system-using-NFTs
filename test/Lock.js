const { expect } = require("chai");

describe('Products', () => { 
  it("Should create and execute market sales", async function() {
    const Products = await ethers.getContractFactory("Products"); //get nftMarket 
    const products = await Products.deploy();
    await products.deployed();
    const productsAddress = products.address;

    const NFT = await ethers.getContractFactory("NFT") // get nft
    const nft = await NFT.deploy(productsAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;

    const auctionPrice = ethers.utils.parseUnits('100', 'ether');
    // const auctionPrice = ethers.utils.parseUnits('100', 'ether');

    const [_, buyerAddress] = await ethers.getSigners();

    // console.log("buyerAddress", buyerAddress);

    await products.createProduct('Iphone', 'Expensive item', 'Apple', 'Phone', auctionPrice, 12, [123, 234], nftContractAddress, "https://www.mytokenlocation2.com");

    console.log(await products.fetchProducts());
    // let listingPrice = await market.getListingPrice();
    // listingPrice = listingPrice.toString()
   

    // await market.createMarketItem(nftContractAddress, 1, auctionPrice, {value: listingPrice})
    // await market.createMarketItem(nftContractAddress, 2, auctionPrice, {value: listingPrice})
    
  
   
    await products.connect(buyerAddress).sellProduct(1, {value: auctionPrice})

    // let items = await market.fetchMarketItems()
    // let myItems = await market.connect(buyerAddress).fetchMyNFTs()
    // items = await Promise.all(items.map(async i => {
    //   const tokenUri = await nft.tokenURI(i.tokenId)
    //   let item = {
    //     price: i.price.toString(),
    //     tokenId: i.tokenId.toString(),
    //     seller: i.seller, 
    //     owner: i.owner,
    //     tokenUri
    //   }
    //   return item 
    // }))
    // console.log("items:", items);
    // myItems = await Promise.all(myItems.map(async i => {
    //   const tokenUri = await nft.tokenURI(i.tokenId)
    //   let item = {
    //     price: i.price.toString(),
    //     tokenId: i.tokenId.toString(),
    //     seller: i.seller, 
    //     owner: i.owner,
    //     tokenUri
    //   }
    //   return item 
    // }))
    // console.log("my items:", myItems);

  });
 });
 
