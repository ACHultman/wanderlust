import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@mantine/hooks';

export type MapCenter = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export type MapMarker = {
  location: {
    lat: number;
    lng: number;
  };
  label: string;
};

type MapContextType = {
  center: MapCenter;
  markers: MapMarker[];
  setCenter: (center: MapCenter) => void;
  addMarkers: (markers: MapMarker[]) => void;
};

const DEFAULT_VIEWPORT = {
  latitude: 49.316666,
  longitude: -123.066666,
  zoom: 10,
};

const MapContext = createContext<MapContextType>({
  center: DEFAULT_VIEWPORT,
  markers: [],
  setCenter: () => {},
  addMarkers: () => {},
});

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [center, setCenter] = useLocalStorage<MapCenter>({
    key: 'mapCenter',
    defaultValue: DEFAULT_VIEWPORT,
  });
  const [markers, setMarkers] = useLocalStorage<MapMarker[]>({
    key: 'mapMarkers',
    defaultValue: [],
  });

  function addMarkers(newMarkers: MapMarker[]) {
    setMarkers((prevMarkers) => [...prevMarkers, ...newMarkers]);
  }

  return (
    <MapContext.Provider value={{ center, markers, setCenter, addMarkers }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};

export default MapContext;
