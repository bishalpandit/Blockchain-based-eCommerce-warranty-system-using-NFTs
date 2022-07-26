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
    console.log("Product address", productsAddress);
    console.log("NFT address", nftContractAddress);
    const auctionPrice = ethers.utils.parseUnits('100', 'ether');

    const [_, buyerAddress, thirdPerson] = await ethers.getSigners();

    await products.createProduct('Iphone', 'Expensive item', 'Apple', 'Phone', auctionPrice, 12, [123, 234], nftContractAddress, "https://www.mytokenlocation2.com", { value: "4" });

    console.log("Current Token owner: " + await products.getTokenOwner(234, nftContractAddress));

    console.log(await products.getProducts());
   
    await products.connect(buyerAddress).sellProduct(1, { value: auctionPrice });

    console.log("Current Token owner: " + await products.getTokenOwner(234, nftContractAddress));

    console.log(await products.getProducts());
    console.log(await products.connect(buyerAddress).getMyProducts());

    await nft.connect(buyerAddress).giveOwnershipToContract()
    await products.connect(buyerAddress).transferProduct(2, "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC");

    console.log("Current Token owner: " + await products.getTokenOwner(234, nftContractAddress));
    console.log(await products.connect(thirdPerson).getMyProducts());

  });
 });
 
