import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/search", async (req, res) => {
	try {
		const { token } = req.query;
		console.log("token:", token);

		const response = await axios.get(
			`https://api.coingecko.com/api/v3/coins/${token}`
		);

		if (
			response.data &&
			response.data.platforms &&
			response.data.platforms.ethereum
		) {
			res.json({
				name: response.data.name,
				symbol: response.data.symbol,
				address: response.data.platforms,
			});
		} else {
			res.status(404).json({ error: "Token not found on Ethereum." });
		}
	} catch (error: any) {
		res.status(500).json({
			error: "Failed to fetch token data.",
			details: error.message,
		});
	}
});

export default router;
