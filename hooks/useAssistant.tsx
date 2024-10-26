import { useEffect, useRef } from 'react';
import { useAssistant as useAiAssistant } from 'ai/react';
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

  const useAssistantHelpers = useAiAssistant({
    api: '/api/openai/run-assistant',
  });

  const { messages, setThreadId } = useAssistantHelpers;

  const processedMessageIds = useRef<Set<string>>(new Set());

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

  return {
    ...useAssistantHelpers,
    messages,
    setThreadId,
  };
};

export default useAssistant;
