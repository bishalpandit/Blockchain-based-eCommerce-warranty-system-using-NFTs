const axios = require("axios");

  let data = JSON.stringify({
  "jsonrpc": "2.0",
  "id": 0,
  "method": "alchemy_getAssetTransfers",
  "params": [
    {
      "fromBlock": "0x0",
      "fromAddress": "0xE2Ecc423A7dD603984ef26523986528037E7fF9a",
      "category": ["erc721"]
    }
  ]
});

  var requestOptions = {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: data,
  };

  const apiKey = "u8T-DCJZrAIHBwsyaZFDkggbSgKjIhqX"
  const baseURL = `https://eth-goerli.g.alchemy.com/v2/u8T-DCJZrAIHBwsyaZFDkggbSgKjIhqX`;
  const axiosURL = `${baseURL}`;

  axios(axiosURL, requestOptions)
    .then(response => console.log(JSON.stringify(response.data, null, 2)))
    .catch(error => console.log(error));