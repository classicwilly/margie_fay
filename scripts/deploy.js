import hre from "hardhat";
const { ethers, upgrades } = hre;

async function main() {
  console.log("🚀 Deploying G.O.D. Smart Contracts to Local Network...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());
  console.log();

  // Deploy Memorial Fund DAO
  console.log("📜 Deploying MemorialFundDAO...");
  const MemorialFundDAO = await ethers.getContractFactory("MemorialFundDAO");
  const memorialFund = await MemorialFundDAO.deploy();
  await memorialFund.waitForDeployment();
  const memorialFundAddress = await memorialFund.getAddress();
  console.log("✅ MemorialFundDAO deployed to:", memorialFundAddress);
  console.log();

  // Deploy Governance DAO
  console.log("🗳️  Deploying GovernanceDAO...");
  const GovernanceDAO = await ethers.getContractFactory("GovernanceDAO");
  const governance = await GovernanceDAO.deploy();
  await governance.waitForDeployment();
  const governanceAddress = await governance.getAddress();
  console.log("✅ GovernanceDAO deployed to:", governanceAddress);
  console.log();

  // Output configuration
  console.log("📋 Add to .env.local:");
  console.log(`NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545`);
  console.log(`NEXT_PUBLIC_CHAIN_ID=31337`);
  console.log(`MEMORIAL_FUND_ADDRESS=${memorialFundAddress}`);
  console.log(`GOVERNANCE_DAO_ADDRESS=${governanceAddress}`);
  console.log();

  console.log("✨ Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
