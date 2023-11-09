import { useLocalStorage } from '@mantine/hooks';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useThread() {
  const [threadID, setThreadID] = useLocalStorage({ key: 'threadID', defaultValue: null });

  const { data, error, isLoading } = useSWR(
    threadID ? null : '/api/openai/create-thread',
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      onSuccess: (data) => {
        // Only set the thread ID if we fetched a new one
        if (data?.id && !threadID) {
          setThreadID(data.id);
        }
      },
    }
  );

  async function resetThread() {
    // delete thread
    await fetch(`/api/openai/delete-thread`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        threadID,
      }),
    });

    setThreadID(null);
  }

  return {
    threadID,
    resetThread,
    thread: data,
    isLoading,
    isError: error,
  };
}
