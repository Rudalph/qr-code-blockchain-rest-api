import { Web3 } from 'web3';
import { HttpProvider } from 'web3-providers-http';
import express from 'express';
import cors from "cors";

// Blockchain Configuration
const INFURA_URL = 'https://sepolia.infura.io/v3/39715bab56e746109b70cff36598e0f2';
const PRIVATE_KEY = '33b5deb26cc43522d0b3e040dd9a9050342017f4495f5a00c8b267962b97ff99';
const CONTRACT_ADDRESS = '0xB8005CFb5e6Ff4A63a770699c5ED71C439066F61'; 
const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "productName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "batchNumber",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "date",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "serialNumber",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "weight",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "manufacturerName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "url",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "hashValue",
				"type": "string"
			}
		],
		"name": "addProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "identifier",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "productName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "serialNumber",
				"type": "string"
			}
		],
		"name": "ProductAdded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "identifier",
				"type": "string"
			}
		],
		"name": "getProduct",
		"outputs": [
			{
				"internalType": "string",
				"name": "productName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "batchNumber",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "date",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "serialNumber",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "weight",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "manufacturerName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "url",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "hashValue",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// Web3 Setup
const web3 = new Web3(new HttpProvider(INFURA_URL));
const account = web3.eth.accounts.privateKeyToAccount('0x' + PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

// Express Setup
const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors({
    origin: "http://localhost:3000",  // Allow requests only from your Next.js app
    methods: ["GET", "POST"],         // Specify allowed HTTP methods
    allowedHeaders: ["Content-Type"], // Specify allowed headers
}));

// Route to get product details
app.get('/product/:identifier', async (req, res) => {
    const { identifier } = req.params;
    console.log(`Fetching product for identifier: ${identifier}`); 

    try {
        const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        const product = await contract.methods.getProduct(identifier).call({
            from: account.address
        });

        const productDetails = {
            productName: product[0],
            batchNumber: product[1].toString(),      // Convert BigInt to String
            location: product[2],
            date: product[3].toString(),             // Convert BigInt to String
            serialNumber: product[4].toString(),     // Convert BigInt to String
            price: product[5].toString(),            // Convert BigInt to String
            weight: product[6].toString(),           // Convert BigInt to String
            manufacturerName: product[7],
            url: product[8],
            hashValue: product[9]
        };

        res.status(200).json(productDetails);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product details' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
