import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import etherscanRoutes from "./routes/etherscan";
import coingeckoRoutes from "./routes/coingecko";
import coinmarketcapRoutes from "./routes/coinmarketcap";
import openAIRoutes from "./routes/openAI";
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/etherscan", etherscanRoutes);
app.use("/coingecko", coingeckoRoutes);
app.use("/coinmarketcap", coinmarketcapRoutes);
app.use("/openai", openAIRoutes);

export default app;
