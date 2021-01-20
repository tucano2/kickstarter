const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compileResult = require("../ethereum/compile");
console.log("compiled first 500 char is: " + compileResult.substring(0, 500));
console.log(
  "compiled last 500 char is: " +
    compileResult.substring(compileResult.length - 500, compileResult.length)
);
console.log(
  "compiled parsed result is: " + JSON.parse(compileResult).contracts
);
console.log(
  "compiled .contracts result is: " + JSON.parse(compileResult).contracts[0]
);
const compiledFactory = compileResult.contracts["CampaignFactory"]; //import campaignfactory
const compiledCampaign = compileResult.contracts["Campaign"]; //import campaign

let accounts;
let factory;
let campaignAddress;
let campaign;

console.log("starting mocha test...");

beforeEach(async () => {
  console.log("calling eth3 getAccounts...");
  accounts = await web3.eth.getAccounts();
  console.log("accounts are: " + accounts);
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "1000000" });

  campaignAddress = await factory.methods.getDeployedCampaigns().call()[0];
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});
describe("Campaigns", () => {
  it("deploysa factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });
});
