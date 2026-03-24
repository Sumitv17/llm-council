const OpenAI = require('openai');

// Agent 1: gpt-oss-120b non-streaming with reasoning
const agent1 = new OpenAI({
  apiKey: process.env.AGENT1_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

async function getAgent1Response(query) {
  const completion = await agent1.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [{"role":"user","content":query}],
    temperature: 1,
    top_p: 1,
    max_tokens: 4096,
    stream: false
  });
  let response = completion.choices[0]?.message?.content || '';
  const reasoning = completion.choices[0]?.message?.reasoning_content;
  if (reasoning) response = `[Reasoning: ${reasoning}]\\n${response}`;
  return response;
}

// Agent 2: llama-3.1-405b streaming
const agent2 = new OpenAI({
  apiKey: process.env.AGENT2_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

async function getAgent2Response(query) {
  let response = '';
  const completion = await agent2.chat.completions.create({
    model: "meta/llama-3.1-405b-instruct",
    messages: [{"role":"user","content":query}],
    temperature: 0.2,
    top_p: 0.7,
    max_tokens: 1024,
    stream: true
  });
  for await (const chunk of completion) {
    response += chunk.choices[0]?.delta?.content || '';
  }
  return response;
}

// Agent 3: deepseek-v3.2 streaming with reasoning
const agent3 = new OpenAI({
  apiKey: process.env.AGENT3_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

async function getAgent3Response(query) {
  let response = '';
  let reasoning = '';
  const completion = await agent3.chat.completions.create({
    model: "deepseek-ai/deepseek-v3.2",
    messages: [{"role":"user","content":query}],
    temperature: 1,
    top_p: 0.95,
    max_tokens: 8192,
    chat_template_kwargs: {"thinking":true},
    stream: true
  });
  for await (const chunk of completion) {
    const chunkReasoning = chunk.choices[0]?.delta?.reasoning_content;
    if (chunkReasoning) reasoning += chunkReasoning;
    response += chunk.choices[0]?.delta?.content || '';
  }
  if (reasoning) response = `[Reasoning: ${reasoning}]\\n${response}`;
  return response;
}

module.exports = { getAgent1Response, getAgent2Response, getAgent3Response };
