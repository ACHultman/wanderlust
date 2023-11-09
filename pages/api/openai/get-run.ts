import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OpenAI.Beta.Threads.Run | { error: string }>
) {
  try {
    const threadID = req.query.threadID as string;
    const runID = req.query.runID as string;

    if (!threadID) {
      return res.status(400).json({ error: 'Thread ID is required' });
    }

    const run = await openai.beta.threads.runs.retrieve(threadID, runID);

    return res.status(200).json(run);
  } catch (error) {
    console.error('The API encountered an error:', error);

    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
