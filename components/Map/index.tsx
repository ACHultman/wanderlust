import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from '@mantine/core';
import React from 'react';
import Mapbox, { Marker, NavigationControl } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import classes from './Map.module.css';
import { useMap } from '@/context/Map';
import { useMediaQuery } from '@mantine/hooks';
import { cssHalfMainSize, cssMainSize } from '@/theme';

function Map() {
  const sm = useMediaQuery('(max-width: 48em)');
  const { center, markers, setCenter } = useMap();

  return (
    <Box className={classes.box}>
      <Mapbox
        {...center}
        onMove={(evt) => setCenter(evt.viewState)}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        style={{ width: '100%', height: sm ? cssHalfMainSize : cssMainSize }}
        reuseMaps
      >
        <NavigationControl />
        {markers?.map((marker, index) => (
          <Marker
            key={index}
            latitude={marker.location.lat}
            longitude={marker.location.lng}
            popup={new mapboxgl.Popup().setHTML(`<h2>${marker.label}</h2>`)}
          />
        ))}
      </Mapbox>
    </Box>
  );
}

export default Map;
