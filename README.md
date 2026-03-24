# LLM Council

LLM Council is a MERN stack chat app where 3 AI agents (GPT-OSS, Llama, Deepseek via NVIDIA API) respond to user queries independently, then debate to produce a hallucination-free final answer.

## Setup

1. Copy `server/.env.example` to `server/.env` and add your keys if different (already has provided keys).

2. Install MongoDB locally or use MongoDB Atlas, update MONGODB_URI if needed.

3. Backend:
```
cd server
npm install
npm start
```
Server runs on http://localhost:3001

4. Frontend:
```
cd client
npm install
npm run dev
```
App runs on http://localhost:3000 (proxies /api to backend)

## Usage
- Open http://localhost:3000
- Ask a question
- See 3 agent responses, then final debated answer
- History saved in MongoDB

## Test Backend
curl -X POST http://localhost:3001/chat \\
  -H \"Content-Type: application/json\" \\
  -d '{\"query\": \"What is 2+2?\"}'

## Architecture
- Backend: Express, OpenAI.js for agents, Mongoose Mongo
- Frontend: Vite React, Axios, chat UI with loading
