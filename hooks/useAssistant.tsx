import { useEffect, useMemo } from 'react';
import { useAssistant as useAiAssistant } from 'ai/react';
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

  const useAssistantHelpers = useAiAssistant({
    api: '/api/openai/run-assistant',
    threadId,
  });

  useEffect(() => {
    if (useAssistantHelpers.messages.length === 0) {
      useAssistantHelpers.setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: 'Hi there! Where would you like to go?',
        },
      ]);
    }
  }, [useAssistantHelpers.messages, useAssistantHelpers.setMessages]);

  const filteredMessages = useMemo(
    () => useAssistantHelpers.messages.filter((m) => m.role !== 'data'),
    [useAssistantHelpers.messages]
  );

  useEffect(() => {
    useAssistantHelpers.messages.forEach((m) => {
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
          console.log('Adding marker:', data);
          if (dataIsMapMarker(data)) {
            addMarkers([{ location: data.location, label: data.label }]);
          }
          break;
        default:
          break;
      }
    });
  }, [useAssistantHelpers.messages, setCenter, addMarkers]);

  return {
    ...useAssistantHelpers,
    messages: filteredMessages,
    resetThread,
  };
};

export default useAssistant;
