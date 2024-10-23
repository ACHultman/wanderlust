import { useEffect, useMemo, useRef, useState } from 'react';
import { Message, useAssistant as useAiAssistant } from 'ai/react';
import { useThread } from './useThread';
import { MapCenter, MapMarker, useMap } from '@/context/Map';

function dataIsMapCenter(data: unknown): data is MapCenter {
  return (
    !!data &&
    typeof data === 'object' &&
    'longitude' in data &&
    'latitude' in data &&
    'zoom' in data
  );
}

function dataIsMapMarker(data: unknown): data is MapMarker {
  return !!data && typeof data === 'object' && 'location' in data && 'label' in data;
}

const useAssistant = () => {
  const { setCenter, addMarkers } = useMap();
  const { threadId, resetThread } = useThread();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const useAssistantHelpers = useAiAssistant({
    api: '/api/openai/run-assistant',
    threadId,
  });

  let { messages } = useAssistantHelpers;

  const processedMessageIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (messages.length === 0) {
      useAssistantHelpers.setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: 'Hi there! Where would you like to go?',
        },
      ]);
    }
  }, [messages]);

  useEffect(() => {
    messages.forEach((m) => {
      if (processedMessageIds.current.has(m.id)) {
        return;
      }

      if (m.role !== 'data' || !m.data || typeof m.data !== 'object' || !('type' in m.data)) {
        return;
      }

      const { type, ...data } = m.data;

      switch (type) {
        case 'update_map':
          if (dataIsMapCenter(data)) {
            setCenter(data);
          }
          break;
        case 'add_marker':
          if (dataIsMapMarker(data)) {
            addMarkers([{ location: data.location, label: data.label }]);
          }
          break;
        default:
          break;
      }

      processedMessageIds.current.add(m.id);
    });
  }, [messages, setCenter, addMarkers]);

  useEffect(() => {
    setChatMessages(messages.filter((m) => m.role !== 'data'));
  }, [messages]);

  return {
    ...useAssistantHelpers,
    messages: chatMessages,
    resetThread,
  };
};

export default useAssistant;
