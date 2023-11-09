import { Text, Group, Box } from '@mantine/core';
import { IconCompass } from '@tabler/icons-react';
import { Message } from '@/types/openai';

type Props = {
  message: Message;
  isLast: boolean;
};

export default function Message({ message, isLast }: Props) {
  return (
    <Group wrap="nowrap" align="flex-start" grow>
      <Box c={!isLast ? 'dimmed' : ''}>
        <IconCompass
          size={32}
          style={{ maxWidth: '32px' }}
          visibility={message.role === 'assistant' ? 'visible' : 'hidden'}
        />
      </Box>
      {message.content.map((item, idx) => (
        <Text key={idx} size="xl" maw="100%" c={!isLast ? 'dimmed' : ''}>
          {item.text?.value ?? ''}
        </Text>
      ))}
    </Group>
  );
}
