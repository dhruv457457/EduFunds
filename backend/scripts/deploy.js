const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying contracts...");

  // Deploy FundTransferWithRegistry contract
  const FundTransferWithRegistry = await hre.ethers.getContractFactory("FundTransferWithRegistry");
  const fundTransferWithRegistry = await FundTransferWithRegistry.deploy();
  await fundTransferWithRegistry.waitForDeployment(); 
  console.log(`✅ FundTransferWithRegistry deployed at: ${fundTransferWithRegistry.target}`);
  
 
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
