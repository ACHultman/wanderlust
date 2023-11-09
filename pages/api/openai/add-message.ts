import { Message } from '@/types/openai';
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Message | { error: string }>
) {
  try {
    const { threadID, content, files } = req.body;

    if (!threadID) {
      return res.status(400).json({ error: 'Thread ID is required' });
    }

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const message = await openai.beta.threads.messages.create(threadID, {
      role: 'user',
      content: content,
      file_ids: files,
    });

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      id: message.id,
      role: message.role,
      content: message.content,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Unknown error' });
  }
}
