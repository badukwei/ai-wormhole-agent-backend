# Wormhole Query AI - Backend  

This backend service powers the **Wormhole Query AI** application. It processes user queries using an AI agent, retrieves on-chain data via **Wormhole Query**, and returns structured results.  

## Features  
- Parses natural language queries with AI  
- Fetches on-chain data using **Wormhole Query**  
- Provides structured API responses  

## Local Development & Setup  

### 1. Install dependencies  
Ensure you have **Node.js** installed, then run:  
```bash
npm install
```

### 2. Set up environment variables  
Create a `.env` file in the project root and add the following variables:  

```env
CMC_API_KEY=your_coinmarketcap_api_key
OPENAI_API_KEY=your_openai_api_key
```

Replace `your_coinmarketcap_api_key` and `your_openai_api_key` with your actual API keys.

### 3. Start the backend server  

#### Development mode  
For live reload during development, use:  
```bash
npm run dev
```

#### Production mode  
To build and start the production server, run:  
```bash
npm run build
npm start
```

### 4. API Endpoints  
Once running, the backend will be accessible at `http://localhost:5050` (or another configured port).  

## Available Scripts  

- **`npm run dev`** → Starts the server in development mode using `ts-node-dev`  
- **`npm run build`** → Compiles TypeScript to JavaScript (`dist/` folder)  
- **`npm start`** → Runs the compiled JavaScript server (`dist/index.js`)  
- **`npm test`** → Placeholder for running tests  

## Future Enhancements  
- Implement robust error handling  
- Add caching for improved query performance  
- Extend API functionality for additional blockchain integrations  