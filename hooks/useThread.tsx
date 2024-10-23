import { useLocalStorage } from '@mantine/hooks';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useThread() {
  const [threadId, setthreadId] = useLocalStorage({ key: 'threadId', defaultValue: undefined });

  const { data, error, isLoading } = useSWR(
    threadId ? null : '/api/openai/create-thread',
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      onSuccess: (t) => {
        // Only set the thread ID if we fetched a new one
        if (t?.id && !threadId) {
          setthreadId(t.id);
        }
      },
    }
  );

  async function resetThread() {
    // delete thread
    await fetch('/api/openai/delete-thread', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        threadId,
      }),
    });

    setthreadId(undefined);
  }

  return {
    threadId,
    resetThread,
    thread: data,
    isLoading,
    isError: error,
  };
}
