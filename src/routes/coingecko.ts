import express from "express";
import axios from "axios";

const router = express.Router();

let tokenCache: any[] | null = null;

/**
 *  get token id from coingecko
 */
async function getTokenId(symbol: string): Promise<string | null> {
	try {
		if (!tokenCache) {
			console.log("Fetching token list from Coingecko...");
			const response = await axios.get(
				"https://api.coingecko.com/api/v3/coins/list?include_platform=true"
			);
			tokenCache = response.data;
		}

		const tokenData = tokenCache?.find(
			(token: any) => token.symbol.toLowerCase() === symbol.toLowerCase()
		);
		const tokenDataArray = tokenCache?.filter(
			(token: any) => token.symbol.toLowerCase() === symbol.toLowerCase()
		);

		console.log("tokenData:", tokenDataArray);
		return tokenData ? tokenData.id : null;
	} catch (error) {
		console.error("Error fetching token ID:", error);
		return null;
	}
}

router.get("/search", async (req, res) => {
	try {
		let { token } = req.query;
		if (!token) {
			res.status(400).json({ error: "Token query is required." });
			return 
		}

		console.log("Token:", token);

		const tokenId = await getTokenId(token as string);
		if (!tokenId) {
			res.status(404).json({ error: "Token not found in Coingecko." });
			return;
		}

		const response = await axios.get(
			`https://api.coingecko.com/api/v3/coins/${tokenId}`
		);
		const data = response.data;
		console.log("data:", data.name);

		if (!data || !data.platforms) {
			res.status(404).json({
				error: "Token not found or has no contract addresses.",
			});
			return;
		}

		const addressList = Object.entries(data.platforms).map(
			([chain, address]) => ({
				chain,
				address,
			})
		);

		console.log("Address List:", addressList);

		res.json({
			name: data.name,
			symbol: data.symbol,
			addresses: addressList,
		});
	} catch (error: any) {
		res.status(500).json({
			error: "Failed to fetch token data.",
			details: error.message,
		});
	}
});

export default router;
