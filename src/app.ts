import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import etherscanRoutes from "./routes/etherscan";
import coingeckoRoutes from "./routes/coingecko";

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/etherscan", etherscanRoutes);
app.use("/coingecko", coingeckoRoutes);

export default app;
