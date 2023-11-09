import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OpenAI.Beta.Threads.ThreadDeleted | { error: string }>
) {
  try {
    const { threadID } = req.body;

    const threadDeleted = await openai.beta.threads.del(threadID);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(threadDeleted);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }
}
