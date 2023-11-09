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
    return res.status(200).json(thread);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
