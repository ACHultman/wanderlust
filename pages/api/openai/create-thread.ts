import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI();

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse<OpenAI.Beta.Threads.Thread | { error: string }>
) {
  try {
    const thread = await openai.beta.threads.create();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(thread);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }
}
