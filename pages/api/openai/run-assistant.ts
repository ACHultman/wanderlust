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
      return res.status(400).json({ error: 'Thread ID is required' });
    }

    const run = await openai.beta.threads.runs.create(threadID, {
      assistant_id: assistantID || process.env.OPENAI_ASSISTANT_ID,
    });

    return res.status(200).json(run);
  } catch (error) {
    console.error('The API encountered an error:', error);

    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
