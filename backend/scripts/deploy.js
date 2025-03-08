const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners(); // Get the deployer's address
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy UserRegistry
  const UserRegistry = await hre.ethers.getContractFactory("UserRegistry");
  const userRegistry = await UserRegistry.deploy(deployer.address); // Pass deployer as initialOwner
  await userRegistry.waitForDeployment();

  console.log("UserRegistry deployed to:", await userRegistry.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });