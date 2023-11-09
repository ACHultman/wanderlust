import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OpenAI.Beta.Threads.Run | { error: string }>
) {
  try {
    const { threadID, assistantID } = req.body;

    if (!threadID) {
      res.status(400).json({ error: 'Thread ID is required' });
      return;
    }

    const run = await openai.beta.threads.runs.create(threadID, {
      assistant_id: assistantID || process.env.OPENAI_ASSISTANT_ID,
    });

    res.status(200).json(run);
  } catch (error) {
    console.error('The API encountered an error:', error);

    res.status(500).json({ error: 'Internal Server Error' });
  }
}
