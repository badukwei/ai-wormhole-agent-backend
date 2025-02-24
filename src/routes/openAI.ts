import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

router.post("/query-basic", async (req, res) => {
	try {
		const { query } = req.body;

		if (!query) {
			res.status(400).json({ error: "Query is required" });
			return;
		}

		const completion = await openai.chat.completions.create({
			messages: [
				{
					role: "system",
					content: [
						{
							type: "text",
							text: 'Your task is to function as an AI blockchain assistant, helping users retrieve on-chain data using the Wormhole Query by extracting necessary parameters from a user\'s query and returning a structured JSON response.\n\n### Required Extraction:\n\n- **token**: The name or symbol of the cryptocurrency (e.g., ETH, USDC, BTC).\n- **chain**: The blockchain network (e.g., Ethereum, Polygon, BSC, Solana).\n- **method**: The type of data the user wants to retrieve (e.g., `totalSupply`, `balanceOf`, `decimals`, `symbol`).\n- **userAddress**: If the user wants to check their balance, extract the wallet address.\n\n### Rules:\n- Default to Ethereum if the blockchain is not specified.\n- Validate that `userAddress` is provided if the user requests a balance check.\n- Indicate `"ambiguous": true` if the token name provided by the user is ambiguous.\n- Return `"valid": false` if the query is invalid or unclear.\n\n# Steps\n\n1. Analyze the user\'s query to identify and extract the potential values for `token`, `chain`, `method`, and `userAddress`.\n2. Determine if the `chain` is specified; if not, default to Ethereum.\n3. Check for ambiguities in the `token` name and flag them.\n4. Verify if the query is valid, ensuring all necessary parameters are extracted.\n5. Construct the JSON response based on the extracted parameters and rules.\n\n# Output Format\n\nRespond with a JSON object structured as follows:\n\n```json\n{\n  "valid": true or false,\n  "token": "[extracted token]",\n  "chain": "[extracted chain or default]",\n  "method": "[extracted method]",\n  "userAddress": "[extracted address or null]",\n  "ambiguous": true or false\n}\n```\n\n# Examples\n\n## Example 1\n\n**User Query:** "What\'s the total supply of USDC on BSC?"\n\n**Output:**\n```json\n{\n  "valid": true,\n  "token": "usdc",\n  "chain": "bsc",\n  "method": "totalSupply",\n  "userAddress": null,\n  "ambiguous": false\n}\n```\n\n## Example 2\n\n**User Query:** "I want to check my balance of BTC."\n\n**Output:**\n```json\n{\n  "valid": false,\n  "token": "btc",\n  "chain": "ethereum",\n  "method": "balanceOf",\n  "userAddress": null,\n  "ambiguous": true\n}\n```\n\n# Notes\n\n- Ensure to address any ambiguity in token naming to maintain accurate data retrieval.\n- Remember to adhere to user privacy while processing `userAddress`.\n- Handle edge cases where queries may be incomplete or conflicting.',
						},
					],
				},
				{ role: "user", content: query },
			],
			model: "gpt-4o",
			response_format: {
				type: "json_object",
			},
			temperature: 1,
			max_completion_tokens: 2048,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
		});

		const response = completion.choices[0].message.content;

		res.json({ result: response });
	} catch (error) {
		console.error("OpenAI API Error:", error);
		res.status(500).json({ error: "Error processing your request" });
	}
});

router.post("/error-handling", async (req, res) => {
	try {
		const { query } = req.body;

		if (!query) {
			res.status(400).json({ error: "Query is required" });
			return;
		}

		const completion = await openai.chat.completions.create({
			messages: [
				{
					role: "system",
					content: [
						{
							type: "text",
							text: 'Ensure all required parameters are correctly provided before processing a blockchain query using the Wormhole Query API. Prompt the user for any missing or ambiguous information.\n\n# Required Parameters\n\n- **token**: The cryptocurrency token name or symbol (e.g., `ETH`, `USDC`, `BTC`).\n- **chain**: The blockchain network (e.g., `Ethereum`, `Polygon`, `BSC`, `Solana`).\n- **method**: The type of data to retrieve (`totalSupply`, `balanceOf`, `decimals`, `symbol`).\n- **userAddress**: Required only if `balanceOf` is requested. Specifies the wallet address to check balance.\n\n# Rules\n\n1. **Missing Chain**: If `chain` is missing, suggest common chains for the specified token.\n2. **Missing User Address**: If `balanceOf` is requested but `userAddress` is missing, ask for the wallet address.\n3. **Ambiguous Token**: If the `token` is ambiguous and exists on multiple chains, list possible chains and ask the user to specify.\n4. **Invalid Query**: If the query is unclear or parameters are incorrectly formatted, return `"valid": false` and explain why.\n\n# Output Format\n\nThe response should be in JSON format:\n\n- **status**: Indicate whether the input is `complete` or `incomplete`.\n- **message**: Provide a message requesting more details or clarifying ambiguities.\n- **missingFields**: A list of any missing parameters.\n\nExample response for missing parameters or ambiguities:\n\n```json\n{\n  "status": "incomplete",\n  "message": "I need more details. The token USDC is available on multiple chains. Which one are you interested in? Options: Ethereum, BSC, Polygon.",\n  "missingFields": ["chain"]\n}\n```\n\n# Examples\n\n### Example 1: Missing Chain\n**Input**: `{"token": "USDC", "method": "totalSupply"}`  \n**Output**: \n```json\n{\n  "status": "incomplete",\n  "message": "I need more details. USDC exists on multiple chains. Which one are you interested in? Options: Ethereum, BSC, Polygon.",\n  "missingFields": ["chain"]\n}\n```\n\n### Example 2: Missing User Address\n**Input**: `{"token": "ETH", "chain": "Ethereum", "method": "balanceOf"}`  \n**Output**:\n```json\n{\n  "status": "incomplete",\n  "message": "Please provide a user address to check the balance.",\n  "missingFields": ["userAddress"]\n}\n```',
						},
					],
				},
				{ role: "user", content: query },
			],
			model: "gpt-4o",
			response_format: {
				type: "json_object",
			},
			temperature: 1,
			max_completion_tokens: 2048,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
		});

		const response = completion.choices[0].message.content;

		res.json({ result: response });
	} catch (error) {
		console.error("OpenAI API Error:", error);
		res.status(500).json({ error: "Error processing your request" });
	}
});

export default router;
