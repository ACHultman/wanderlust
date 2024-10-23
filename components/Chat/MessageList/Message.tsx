import { Text, Group, Box } from '@mantine/core';
import { IconCompass } from '@tabler/icons-react';
import type { Message as MessageType } from 'ai';

type Props = {
  message: MessageType;
};

export default function Message({ message }: Props) {
  return (
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
  );
}
