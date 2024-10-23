import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OpenAI.Beta.Threads.Run | { error: string }>
) {
  try {
    const threadId = req.query.threadId as string;
    const runID = req.query.runID as string;

    if (!threadId) {
      return res.status(400).json({ error: 'Thread ID is required' });
    }

    const run = await openai.beta.threads.runs.retrieve(threadId, runID);

    return res.status(200).json(run);
  } catch (error) {
    console.error('The API encountered an error:', error);

    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
