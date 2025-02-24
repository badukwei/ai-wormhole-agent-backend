import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const CMC_API_KEY = process.env.CMC_API_KEY;
const CMC_API_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/info";

/**
 * search token address
 */
router.get("/search", async (req, res) => {
	try {
		const { token } = req.query;
		if (!token) {
			res.status(400).json({ error: "Token symbol is required." });
			return;
		}

		console.log(`CoinMarketCap Token: ${token}`);

		const response = await axios.get(CMC_API_URL, {
			headers: { "X-CMC_PRO_API_KEY": CMC_API_KEY },
			params: { symbol: String(token).toUpperCase() },
		});

		const tokenData = response.data?.data?.[String(token).toUpperCase()];
		if (!tokenData) {
			res.status(404).json({ error: "Token not found on CoinMarketCap." });
			return;
		}

		const addresses = tokenData.contract_address.map((entry: any) => ({
			chain: entry.platform.name,
			address: entry.contract_address,
		}));

		res.json({
			name: tokenData.name,
			symbol: tokenData.symbol,
			addresses,
		});
	} catch (error: any) {
		console.error(
			"Error fetching CoinMarketCap data:",
			error.response?.data || error.message
		);
		res.status(500).json({
			error: "Failed to fetch token data.",
			details: error.message,
		});
	}
});

export default router;

