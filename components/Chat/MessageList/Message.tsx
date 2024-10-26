import { memo } from 'react';
import { Text, Group, Box } from '@mantine/core';
import { IconCompass } from '@tabler/icons-react';
import type { Message as MessageType } from 'ai';

type Props = {
  message: MessageType;
};

const Message = memo(({ message }: Props) => (
  <Group wrap="nowrap" align="flex-start" grow>
    <Box>
      <IconCompass
        size={32}
        style={{ maxWidth: '32px' }}
        visibility={message.role === 'assistant' ? 'visible' : 'hidden'}
      />
    </Box>
    <Text size="xl" maw="100%">
      {message.content ?? ''}
    </Text>
  </Group>
));

export default Message;
