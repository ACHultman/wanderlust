import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OpenAI.Beta.Threads.Run | { error: string }>
) {
  try {
    // Get the thread ID and run ID from the query params
    const threadID = req.query.threadID as string;
    const runID = req.query.runID as string;

    if (!threadID) {
      res.status(400).json({ error: 'Thread ID is required' });
      return; // Stop the execution here
    }

    const run = await openai.beta.threads.runs.retrieve(threadID, runID);

    res.status(200).json(run); // Send the response without return
  } catch (error) {
    // Log the error for internal debugging
    console.error('The API encountered an error:', error);

    // Send a response to avoid unresolved requests
    res.status(500).json({ error: 'Internal Server Error' });
  }
  // No need to return anything here
}
