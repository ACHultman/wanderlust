import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OpenAI.Beta.Threads.Run | { error: string }>
) {
  try {
    const { threadID, runID, toolOutputs } = req.body;

    if (!threadID) {
      return res.status(400).json({ error: 'Thread ID is required' }); // Use return here
    }

    if (!runID) {
      return res.status(400).json({ error: 'Run ID is required' }); // Use return here
    }

    if (!toolOutputs) {
      return res.status(400).json({ error: 'Tool outputs are required' }); // Use return here
    }

    const run = await openai.beta.threads.runs.submitToolOutputs(threadID, runID, {
      tool_outputs: toolOutputs,
    });

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(run);
  } catch (error) {
    console.error('The API encountered an error:', error);

    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
