import OpenAI from 'openai';
import { AssistantResponse } from 'ai';

export const config = {
  runtime: 'edge',
};

const openai = new OpenAI();

export default async function handler(req: Request) {
  try {
    const input: {
      threadId: string | null;
      message: string;
    } = await req.json();

    const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;
    const { message } = input;

    const assistantId = process.env.OPENAI_ASSISTANT_ID || '';

    if (!threadId) {
      return new Response('Thread ID is required', { status: 400 });
    }

    if (!message) {
      return new Response('Message is required', { status: 400 });
    }

    if (!assistantId) {
      return new Response('Assistant ID is required', { status: 400 });
    }

    const createdMessage = await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });

    return AssistantResponse(
      { threadId, messageId: createdMessage.id },
      async ({ forwardStream, sendDataMessage }) => {
        const runStream = openai.beta.threads.runs.stream(threadId, {
          assistant_id: assistantId,
        });

        let runResult = await forwardStream(runStream);

        // Handle tool calls if any are required.
        while (
          runResult?.status === 'requires_action' &&
          runResult.required_action?.type === 'submit_tool_outputs'
        ) {
          const tool_outputs = runResult.required_action.submit_tool_outputs.tool_calls.map(
            (toolCall: any) => {
              const parameters = JSON.parse(toolCall.function.arguments);

              switch (toolCall.function.name) {
                case 'update_map':
                  const { longitude, latitude, zoom } = parameters;

                  sendDataMessage({
                    role: 'data',
                    data: {
                      type: 'update_map',
                      longitude,
                      latitude,
                      zoom,
                    },
                  });

                  return {
                    tool_call_id: toolCall.id,
                    output: `Map updated to center: ${longitude}, ${latitude} with zoom ${zoom}`,
                  };

                case 'add_marker':
                  const { longitude: markerLng, latitude: markerLat, label } = parameters;

                  sendDataMessage({
                    role: 'data',
                    data: {
                      type: 'add_marker',
                      location: { lat: markerLat, lng: markerLng },
                      label,
                    },
                  });

                  return {
                    tool_call_id: toolCall.id,
                    output: `Marker added at ${markerLng}, ${markerLat} with label "${label}"`,
                  };

                default:
                  throw new Error(`Unknown tool call function: ${toolCall.function.name}`);
              }
            }
          );

          runResult = await forwardStream(
            openai.beta.threads.runs.submitToolOutputsStream(threadId, runResult.id, {
              tool_outputs,
            })
          );
        }
      }
    );
  } catch (error) {
    console.error('The API encountered an error:', error);

    // return res.status(500).json({ error: 'Internal Server Error' });
    return new Response('Internal Server Error', { status: 500 });
  }
}
