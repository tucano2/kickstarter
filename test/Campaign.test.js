const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compileResultAsJSON = JSON.parse(require("../ethereum/compile"));
console.log("compiled result as JSON: " + compileResultAsJSON);
console.log(
  "campaign: " + JSON.stringify(compileResultAsJSON.contracts.Campaign.Campaign)
);
const compiledFactory = compileResultAsJSON.contracts.Campaign.CampaignFactory; //import campaignfactory
const compiledCampaign = compileResultAsJSON.contracts.Campaign.Campaign; //import campaign

let accounts;
let factory;
let campaignAddress;
let campaign;

console.log("starting mocha test...");

beforeEach(async () => {
  console.log("calling eth3 getAccounts...");
  accounts = await web3.eth.getAccounts();
  console.log("accounts are: " + accounts);
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: "0x" + compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "2000000" });

  await factory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "2000000" });

  campaignAddress = await factory.methods.getDeployedCampaigns().call()[0];
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});
describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    //assert.ok(campaign.options.address);
  });
});
