const hre = require("hardhat");

async function main() {
  const PolyToken = await hre.ethers.getContractFactory("PolyToken");
  const polyToken = await PolyToken.deploy(100);

  await polyToken.deployed();

  console.log("PolyToken contract address:", polyToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
