import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTheme, useMediaQuery } from '@mui/material';
import dimensions from '../../common/theme/dimensions';
import { map } from '../core/MapView';
import { usePrevious } from '../../reactHelper';
import { useAttributePreference } from '../../common/util/preferences';

const MapSelectedDevice = ({ mapReady }) => {
  const currentTime = useSelector((state) => state.devices.selectTime);
  const currentId = useSelector((state) => state.devices.selectedId);
  const previousTime = usePrevious(currentTime);
  const previousId = usePrevious(currentId);

  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down('md'));

  const selectZoom = useAttributePreference('web.selectZoom', 10);
  const mapFollow = useAttributePreference('mapFollow', false);

  const position = useSelector((state) => state.session.positions[currentId]);

  const previousPosition = usePrevious(position);

  useEffect(() => {
    if (!mapReady) return;

    const positionChanged =
      position &&
      (!previousPosition ||
        position.latitude !== previousPosition.latitude ||
        position.longitude !== previousPosition.longitude);

    if (
      (currentId !== previousId ||
        currentTime !== previousTime ||
        (mapFollow && positionChanged)) &&
      position
    ) {
      // Shift map center up so vehicle appears above the StatusCard
      const verticalOffset = -Math.round(window.innerHeight * 0.25);
      const offset = isPhone
        ? [0, verticalOffset]
        : [0, verticalOffset];

      map.easeTo({
        center: [position.longitude, position.latitude],
        zoom: Math.max(map.getZoom(), selectZoom),
        offset,
      });
    }
  }, [currentId, previousId, currentTime, previousTime, mapFollow, position, selectZoom, mapReady, isPhone]);

  return null;
};

MapSelectedDevice.handlesMapReady = true;

export default MapSelectedDevice;
