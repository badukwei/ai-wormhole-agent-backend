import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

router.post("/query-basic", async (req, res) => {
	try {
		const { messages } = req.body;

		if (!messages || !Array.isArray(messages)) {
			res.status(400).json({ error: "Messages array is required" });
			return;
		}

		const completion = await openai.chat.completions.create({
			messages: [
				{
					role: "system",
					content: [
						{
							type: "text",
							text: 'Act as an AI blockchain assistant to extract structured query parameters from a user\'s request over multiple interactions, validate them, including checking if the method is in the predefined list, and prepare for executing a blockchain query. Ensure that your response tone is humanized and helpful.\n\n### Parameters to Extract\n- **token**: Cryptocurrency name or symbol (e.g., ETH, USDC, BTC).\n- **chain**: Always return as `null`.\n- **method**: Type of data requested, limited to the following options: `totalSupply`, `balanceOf`, `decimals`, `symbol`.\n- **userAddress**: Required only for `balanceOf` queries.\n\n### Validation Rules\n- If `method` is not included in the predefined list, return `"valid": false` and specify the error related to the `method`.\n- Request **userAddress** if missing and `balanceOf` is the method.\n- Tokens will not be considered ambiguous; assume a default chain or specify \'exact match only\'.\n- Return `"valid": false` if the query is invalid or unclear, and list missing fields.\n\n# Steps\n\n1. **Extract Parameters**: Identify and extract `token`, `method`, and `userAddress` from current and previous messages. Ignore `chain`.\n2. **Validate**: \n   - Check if `method` is valid by comparing it with the predefined list.\n   - If `method` is `balanceOf`, ensure `userAddress` is provided.\n   - Confirm query validity or list missing parameters.\n3. **Prepare Response**: Structure the output as specified.\n\n# Output Format\n\nProduce a JSON object:\n```json\n{\n  "valid": true or false,\n  "token": "[extracted token]",\n  "chain": null,\n  "method": "[extracted method]",\n  "userAddress": "[extracted address or null]",\n  "ambiguous": false,\n  "missingFields": ["list of missing parameters (if any)"],\n  "message": "A helpful and friendly response guiding the user"\n}\n```\n\n# Examples\n\n**Example 1:**\n\n- **User Input:** "Get the balance of 0x123... on Polygon"\n- **Previous Input:** "Check USDC"\n- **Reasoning:** \n  - `method` is `balanceOf` and `userAddress` is present from the current message.\n  - `token` is USDC extracted from previous input.\n- **Output JSON:**\n  ```json\n  {\n    "valid": true,\n    "token": "USDC",\n    "chain": null,\n    "method": "balanceOf",\n    "userAddress": "0x123...",\n    "ambiguous": false,\n    "missingFields": [],\n    "message": "Great! Your request is valid and we are ready to fetch the balance."\n  }\n  ```\n\n# Notes\n\n- Ensure context from prior messages is considered for full understanding.\n- Assume tokens are associated with a single chain unless otherwise specified.\n- Address typical issues users might face when specifying their requests.',
						},
					],
				},
				...messages,
			],
			model: "gpt-4o",
			response_format: { type: "json_object" },
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
