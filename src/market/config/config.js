const config = {
  env: process.env.NODE_ENV || 'development',
  infuraUrl: "https://ropsten.infura.io/v3/a1f88129a07f4149ac46569f45af50ab",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  mongoUri: process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
    'mongodb://' + (process.env.IP || 'localhost') + ':' +
    (process.env.MONGO_PORT || '27017') +
    '/mernproject',
  stripe_connect_test_client_id: 'YOUR_stripe_connect_test_client',
  stripe_test_secret_key: 'YOUR_stripe_test_secret_key',
  stripe_test_api_key: 'YOUR_stripe_test_api_key',
  contractAddr: '0xC8778756DDbDe86BA0b8c0B8D13559A6E0719277',
  defaultAddr: '0x37F6Bbe96749fEA346F97CEbafc64c71b012E938', 
  abi: [
    {
      "constant": false,
      "inputs": [
        {
          "name": "txid",
          "type": "address"
        }
      ],
      "name": "completeTx",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "target",
          "type": "address"
        }
      ],
      "name": "giveToken",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "orderId",
          "type": "string"
        },
        {
          "name": "seller",
          "type": "address"
        },
        {
          "name": "sellerEmail",
          "type": "string"
        },
        {
          "name": "sellerPhone",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "uint256"
        },
        {
          "name": "message",
          "type": "string"
        },
        {
          "name": "fee",
          "type": "uint256"
        },
        {
          "name": "PoS",
          "type": "uint256"
        }
      ],
      "name": "makeTx",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "txid",
          "type": "address"
        }
      ],
      "name": "reportTx",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "txid",
          "type": "address"
        },
        {
          "name": "nameOfPage",
          "type": "string"
        },
        {
          "name": "nameofSite",
          "type": "string"
        },
        {
          "name": "accessTime",
          "type": "uint256"
        },
        {
          "name": "url",
          "type": "string"
        }
      ],
      "name": "validate",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "bank",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "",
          "type": "address"
        }
      ],
      "name": "OwnerLog",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "seller",
          "type": "address"
        }
      ],
      "name": "findFraudWithAddres",
      "outputs": [
        {
          "name": "",
          "type": "address[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "email",
          "type": "string"
        }
      ],
      "name": "findFraudWithEmail",
      "outputs": [
        {
          "name": "",
          "type": "address[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "phone",
          "type": "string"
        }
      ],
      "name": "findFraudWithPhone",
      "outputs": [
        {
          "name": "",
          "type": "address[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "id",
          "type": "address"
        }
      ],
      "name": "getBalance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "idx",
          "type": "uint256"
        }
      ],
      "name": "getOpenTx",
      "outputs": [
        {
          "name": "",
          "type": "address"
        },
        {
          "name": "",
          "type": "address"
        },
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "txid",
          "type": "address"
        }
      ],
      "name": "getOrderId",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "txid",
          "type": "address"
        }
      ],
      "name": "getStatus",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "orderId",
          "type": "string"
        }
      ],
      "name": "getTxAddress",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getTxLen",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "txid",
          "type": "address"
        }
      ],
      "name": "getValidation",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "openTxids",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ] 
}

export default config
