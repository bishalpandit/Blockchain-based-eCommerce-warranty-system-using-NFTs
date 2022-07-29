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

    await products.setNFTContract(nftContractAddress);

    console.log("Product address", productsAddress);
    console.log("NFT address", nftContractAddress);
    const auctionPrice = ethers.utils.parseUnits('100', 'ether');

    const [_, buyerAddress, thirdPerson] = await ethers.getSigners();

    const serialNos = [123, 234];
    const tokenURI = "https://www.mytokenlocation2.com";

    serialNos.forEach(token => {
      nft.createToken(tokenURI, token);
    });

    await products.createProduct('Iphone', 'Expensive item', 'Apple', 'Phone', auctionPrice, 0, serialNos, { value: "4" });

   // console.log("Current Token owner: " + await products.getTokenOwner(234));

    console.log("After product creation ", await products.getProducts());
   
    await products.connect(buyerAddress).buyProduct(1, { value: auctionPrice });

    console.log("Current Token owner: " + await products.getTokenOwner(234));

    console.log("After buying product", await products.getProducts());
    console.log(await products.connect(buyerAddress).getMyProducts());

   // await nft.connect(buyerAddress).giveOwnershipToContract()
    await products.connect(buyerAddress).transferProduct(2, "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC");

    console.log("Current Token owner: " + await products.getTokenOwner(234));
    console.log("get Product by TokenId: " , await products.getProductByTokenId(234));
    await products.connect(thirdPerson).validateWarranty();
    console.log(await products.connect(thirdPerson).getMyProducts());
    console.log(await products.connect(buyerAddress).getMyProducts());
    // await products.connect(thirdPerson).burnToken(234);
    // console.log("Current Token owner: " + await products.getTokenOwner(234));
  });
 });
 
