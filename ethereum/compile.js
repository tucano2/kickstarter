const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");
//console.log("input is", source);
//json input descriptor
var input = {
  language: "Solidity",
  sources: {
    Campaign: { content: source }
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"]
      }
    }
  }
};
//const output = solc.compile(JSON.stringify(source));
var output = solc.compile(JSON.stringify(input));

//console.log("Compile output is", output);

module.exports = output;

console.log("done compiling.");
