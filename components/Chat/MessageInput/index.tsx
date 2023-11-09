import { useState } from 'react';
import { TextInput, Button, Stack, Text, Group, ActionIcon, Popover } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowUp, IconTrash } from '@tabler/icons-react';
import classes from './MessageInput.module.css';

type FormValues = {
  message: string;
};

type Props = {
  sendMessageAndRun: (message: string) => void;
  isRunning: boolean;
  resetThread: () => void;
};

export default function MessageInput({ isRunning, sendMessageAndRun, resetThread }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const form = useForm<FormValues>({
    initialValues: {
      message: '',
    },
  });

  function handleSubmit(values: FormValues) {
    if (!values.message.trim()) return;
    sendMessageAndRun(values.message);
    form.reset();
  }

  function handleConfirmReset() {
    resetThread();
    setConfirmOpen(false);
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group
        m="md"
        justify="space-between"
        wrap="nowrap"
        className={isRunning ? classes.gradient : ''}
      >
        <TextInput
          style={{ flexGrow: 1 }}
          size="xl"
          radius="xl"
          placeholder="Start typing..."
          {...form.getInputProps('message')}
          disabled={isRunning}
        />

        <ActionIcon
          type="submit"
          disabled={isRunning}
          size={48}
          maw="lg"
          variant="gradient"
          gradient={{ from: 'indigo', to: 'cyan', deg: 200 }}
          style={{ borderRadius: '32px' }}
        >
          <IconArrowUp />
        </ActionIcon>

        {/* chat clear btn */}
        <Popover
          width={248}
          position="bottom"
          clickOutsideEvents={['mouseup', 'touchend']}
          opened={confirmOpen}
          onChange={setConfirmOpen}
        >
          <Popover.Target>
            <ActionIcon
              variant="default"
              size="xl"
              radius="md"
              aria-label="Restart conversation"
              style={{ borderRadius: '32px' }}
              onClick={() => setConfirmOpen((o) => !o)}
            >
              <IconTrash />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <Stack align="center">
              <Text size="md">Clear Conversation?</Text>
              <Group justify="space-between" w="100%">
                <Button bg="gray" onClick={() => setConfirmOpen(false)}>
                  Cancel
                </Button>
                <Button variant="filled" bg="red" onClick={() => handleConfirmReset()}>
                  Confirm
                </Button>
              </Group>
            </Stack>
          </Popover.Dropdown>
        </Popover>
      </Group>
    </form>
  );
}
