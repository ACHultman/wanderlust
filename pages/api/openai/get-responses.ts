import { Message } from '@/types/openai';
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const initAssistantMessage: Message = {
  id: 'init',
  role: 'assistant',
  content: [{ type: 'text', text: { value: 'Where would you like to go?' } }],
};

const openai = new OpenAI();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | Message[]
    | {
        error: string;
      }
  >
) {
  // get thread id from query params
  const threadID = req.query.threadID as string;

  if (!threadID) {
    return res.status(400).json({ error: 'Thread ID is required' });
  }

  try {
    const threadMessages = await openai.beta.threads.messages.list(threadID, {
      order: 'asc',
    });

    // map to only keep id, role, and content fields
    const messages = threadMessages.data.map(({ id, role, content }) => ({
      id,
      role,
      content,
    }));

    return res.status(200).json([initAssistantMessage, ...messages]);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Unknown error' });
  }
}
