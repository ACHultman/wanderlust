import type { Message as MessageType } from 'ai';
import { Stack } from '@mantine/core';
import classes from './MessageList.module.css';
import Message from './Message';

type Props = {
  messages: MessageType[] | undefined;
};

export default function MessageList({ messages }: Props) {
  if (!messages) {
    return null;
  }

  return (
    <Stack className={classes.scrollable} h="100%" gap="64px" style={{ overflow: 'auto' }}>
      <Message
        key="welcome"
        message={{
          id: 'welcome',
          role: 'assistant',
          content: 'Hi there! Where would you like to go?',
        }}
      />
      {messages
        .filter((message) => !message.data)
        .map((message, index) => (
          <Message key={index} message={message} />
        ))}
    </Stack>
  );
}
