import { Stack, Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { cssHalfMainSize, cssMainSize } from '@/theme';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import useAssistant from '@/hooks/useAssistant';

const Chat = () => {
  const { messages, status, append, setThreadId } = useAssistant();
  const sm = useMediaQuery('(max-width: 48em)');
  const conversationHeightPx = `calc(${sm ? cssHalfMainSize : cssMainSize} - 94px)`; // 94px = 64px (padding) + 30 (input height / 2)

  return (
    <Stack style={sm ? { order: 2 } : {}}>
      <Box
        p="md"
        style={{ position: 'relative', borderRadius: '20px', height: conversationHeightPx }}
      >
        <MessageList messages={messages} />
      </Box>
      <MessageInput
        submitMessage={append}
        isRunning={status === 'in_progress'}
        resetThread={() => setThreadId(undefined)}
      />
    </Stack>
  );
};

export default Chat;
