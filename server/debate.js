const { getAgent1Response } = require('./agents'); // Use agent1 for debate as it's non-streaming with reasoning

async function getDebateFinal(responses) {
  const debatePrompt = `
Three agents responded to the query:
Agent 1 (GPT-OSS): ${responses[0]}
Agent 2 (Llama): ${responses[1]}
Agent 3 (Deepseek): ${responses[2]}

Debate: Discuss differences, identify potential hallucinations or weaknesses in each response. Cancel out incorrect info by cross-verification. Agree on the most accurate, reliable final answer. Provide reasoning then the final answer.
`;

  try {
    const final = await getAgent1Response(debatePrompt);
    return final;
  } catch (error) {
    return 'Debate failed: ' + error.message;
  }
}

module.exports = { getDebateFinal };
