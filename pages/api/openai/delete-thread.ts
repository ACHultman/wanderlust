import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OpenAI.Beta.Threads.ThreadDeleted | { error: string }>
) {
  try {
    const { threadId } = req.body;

    const threadDeleted = await openai.beta.threads.del(threadId);

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(threadDeleted);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
