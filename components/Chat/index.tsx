import { Stack, Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { cssHalfMainSize, cssMainSize } from '@/theme';
import MessageList from './MessageList';
import { Message } from '@/types/openai';
import MessageInput from './MessageInput';

type Props = {
  messages: Message[] | undefined;
  sendMessageAndRun: (message: string) => void;
  isRunning: boolean;
  resetThread: () => void;
};

const Chat = ({ sendMessageAndRun, messages, isRunning, resetThread }: Props) => {
  const sm = useMediaQuery('(max-width: 48em)');

  const conversationHeightPx = `calc(${sm ? cssHalfMainSize : cssMainSize} - 112px)`; // 112px = 64px (padding) + 48px (input height)

  return (
    <Stack style={sm ? { order: 2 } : {}}>
      <Box
        p="md"
        style={{ position: 'relative', borderRadius: '20px', height: conversationHeightPx }}
      >
        <MessageList messages={messages} />
      </Box>
      <MessageInput
        sendMessageAndRun={sendMessageAndRun}
        isRunning={isRunning}
        resetThread={resetThread}
      />
    </Stack>
  );
};

export default Chat;
