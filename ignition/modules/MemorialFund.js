const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MemorialFundDeployment", (m) => {
  const memorialFund = m.contract("MemorialFundDAO");
  return { memorialFund };
});
