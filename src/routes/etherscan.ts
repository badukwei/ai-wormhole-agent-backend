import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

const ETHERSCAN_API_URL = "https://api.etherscan.io/api";
const etherscanApiKey = process.env.ETHERSCAN_API_KEY || "";

router.get("/search", async (req, res) => {
	try {
		const { token } = req.query;

		if (!token || typeof token !== "string") {
			res.status(400).json({
				error: "Please provide a valid token parameter",
			});
			return;
		}

		const response = await axios.get(ETHERSCAN_API_URL, {
			params: {
				module: "token",
				action: "tokenInfo",
				contractAddress: token,
				apiKey: etherscanApiKey,
			},
		});
		console.log("response:", response);
		console.log("response:", response.data);

		if (response.data.status !== "1") {
			res.status(404).json({ error: "contractAddress not found" });
			return;
		}

		const tokenInfo = response.data.result[0];
		console.log(`tokenInfo: ${tokenInfo}`);

		res.json({
			name: tokenInfo.tokenName,
			symbol: tokenInfo.tokenSymbol,
			contractAddress: tokenInfo.contractAddress,
			decimals: tokenInfo.tokenDecimal,
			totalSupply: tokenInfo.totalSupply,
		});
	} catch (error) {
		console.error("Etherscan API error:", error);
		res.status(500).json({ error: "Server error, please try again later" });
	}
});

export default router;
