const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("GovernanceDeployment", (m) => {
  const governance = m.contract("GovernanceDAO");
  return { governance };
});
