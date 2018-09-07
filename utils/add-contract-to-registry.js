const fs = require("fs");
const path = require("path");
const R = require("ramda");
const filePath = path.join(__dirname, "../contracts/index.js");

const contractId = process.env.CONTRACT_ID;

fs.readFile(filePath, "utf8", function(err, contents) {
  console.log("Registry File Content: \n", contents);
  const updatedFile = R.replace(
    /};/g,
    createContractRegistryDefinition(contractId),
    contents
  );
  console.log("Updated Registry: \n", updatedFile);
  fs.writeFile(filePath, updatedFile, function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("The registry was updated!");
  });
});

const createContractRegistryDefinition = (contract_id) =>
  `  ${contract_id}: {\n    spec: require(\"./${contract_id}/spec.json\"),\n    logic: require(\"./${contract_id}/logic\"),\n  },\n};`;
