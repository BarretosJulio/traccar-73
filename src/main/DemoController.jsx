import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { devicesActions, sessionActions, eventsActions } from '../store';

const DEMO_DEVICE_IDS = [99901, 99902, 99903, 99904, 99905];

const DEMO_VEHICLES = [
  { id: 99901, name: 'Fiorino MAB-01', uniqueId: 'DEMO001', category: 'van', status: 'online', phone: '', model: 'Fiat Fiorino', contact: 'João', groupId: 0, disabled: false, positionId: 90001, lastUpdate: new Date().toISOString() },
  { id: 99902, name: 'HB20 MAB-02', uniqueId: 'DEMO002', category: 'car', status: 'online', phone: '', model: 'Hyundai HB20', contact: 'Maria', groupId: 0, disabled: false, positionId: 90002, lastUpdate: new Date().toISOString() },
  { id: 99903, name: 'Truck MAB-03', uniqueId: 'DEMO003', category: 'truck', status: 'online', phone: '', model: 'VW Delivery', contact: 'Carlos', groupId: 0, disabled: false, positionId: 90003, lastUpdate: new Date().toISOString() },
  { id: 99904, name: 'Moto MAB-04', uniqueId: 'DEMO004', category: 'motorcycle', status: 'offline', phone: '', model: 'Honda CG 160', contact: 'Pedro', groupId: 0, disabled: false, positionId: 90004, lastUpdate: new Date().toISOString() },
  { id: 99905, name: 'S10 MAB-05', uniqueId: 'DEMO005', category: 'car', status: 'online', phone: '', model: 'Chevrolet S10', contact: 'Ana', groupId: 0, disabled: false, positionId: 90005, lastUpdate: new Date().toISOString() },
];

// São Paulo region base coordinates
const BASE_POSITIONS = [
  { lat: -23.5505, lng: -46.6333, address: 'Praça da Sé, Centro, São Paulo, SP' },
  { lat: -23.5631, lng: -46.6544, address: 'Av. Paulista, 1578, Bela Vista, São Paulo, SP' },
  { lat: -23.5875, lng: -46.6580, address: 'Parque Ibirapuera, Moema, São Paulo, SP' },
  { lat: -23.5200, lng: -46.5900, address: 'Av. Radial Leste, Tatuapé, São Paulo, SP' },
  { lat: -23.6100, lng: -46.6950, address: 'Av. Interlagos, 2255, Interlagos, São Paulo, SP' },
];

const ALERT_TYPES = [
  { type: 'deviceOverspeed', messageKey: 'demoOverspeed' },
  { type: 'geofenceExit', messageKey: 'demoGeofenceExit' },
  { type: 'geofenceEnter', messageKey: 'demoGeofenceEnter' },
  { type: 'deviceStopped', messageKey: 'demoDeviceStopped' },
  { type: 'alarm', messageKey: 'demoAlarmSos', alarm: 'sos' },
];

const DemoController = ({ active }) => {
  const dispatch = useDispatch();
  const intervalRef = useRef(null);
  const positionsRef = useRef(
    BASE_POSITIONS.map((pos, i) => ({
      lat: pos.lat,
      lng: pos.lng,
      speed: i === 3 ? 0 : 20 + Math.random() * 60, // moto offline = parada
      course: Math.random() * 360,
    })),
  );

  const createPosition = useCallback((deviceId, idx) => {
    const pos = positionsRef.current[idx];
    return {
      id: 90000 + deviceId,
      deviceId,
      protocol: 'demo',
      serverTime: new Date().toISOString(),
      deviceTime: new Date().toISOString(),
      fixTime: new Date().toISOString(),
      valid: true,
      latitude: pos.lat,
      longitude: pos.lng,
      altitude: 750 + Math.random() * 50,
      speed: pos.speed / 1.852, // convert km/h to knots
      course: pos.course,
      address: BASE_POSITIONS[idx].address,
      geofenceIds: [99901, 99903, 99905].includes(deviceId) ? [1001] : [],
      attributes: {
        batteryLevel: 40 + Math.random() * 60,
        ignition: deviceId !== 99904,
        motion: pos.speed > 5,
        blocked: deviceId === 99904,
        distance: Math.random() * 1000,
        totalDistance: 50000 + Math.random() * 100000,
        hours: 360000000 + Math.random() * 100000000,
        sat: 8 + Math.floor(Math.random() * 8),
      },
    };
  }, []);

  const injectDemoData = useCallback(() => {
    // Inject devices
    dispatch(devicesActions.refresh(DEMO_VEHICLES));

    // Inject positions
    const positions = DEMO_VEHICLES.map((v, i) => createPosition(v.id, i));
    dispatch(sessionActions.updatePositions(positions));
  }, [dispatch, createPosition]);

  const updateMovement = useCallback(() => {
    positionsRef.current = positionsRef.current.map((pos, i) => {
      if (i === 3) return pos; // moto stays stopped

      // Random movement
      const speedChange = (Math.random() - 0.5) * 20;
      const newSpeed = Math.max(0, Math.min(120, pos.speed + speedChange));
      const courseChange = (Math.random() - 0.5) * 30;
      const newCourse = (pos.course + courseChange + 360) % 360;

      // Move position based on speed
      const distKm = (newSpeed / 3600) * 3; // 3 seconds interval
      const dLat = (distKm / 111) * Math.cos((newCourse * Math.PI) / 180);
      const dLng = (distKm / (111 * Math.cos((pos.lat * Math.PI) / 180))) * Math.sin((newCourse * Math.PI) / 180);

      return {
        lat: pos.lat + dLat,
        lng: pos.lng + dLng,
        speed: newSpeed,
        course: newCourse,
      };
    });

    const positions = DEMO_VEHICLES.map((v, i) => createPosition(v.id, i));
    dispatch(sessionActions.updatePositions(positions));

    // Random alerts (5% chance per tick)
    if (Math.random() < 0.05) {
      const alertIdx = Math.floor(Math.random() * ALERT_TYPES.length);
      const deviceIdx = Math.floor(Math.random() * DEMO_VEHICLES.length);
      const alert = ALERT_TYPES[alertIdx];
      const device = DEMO_VEHICLES[deviceIdx];

      dispatch(eventsActions.add([{
        id: Date.now(),
        type: alert.type,
        eventTime: new Date().toISOString(),
        deviceId: device.id,
        attributes: {
          message: `[DEMO] ${device.name}: ${alert.messageKey}`,
          ...(alert.alarm ? { alarm: alert.alarm } : {}),
        },
      }]));
    }
  }, [dispatch, createPosition]);

  const cleanupDemo = useCallback(() => {
    DEMO_DEVICE_IDS.forEach((id) => {
      dispatch(devicesActions.remove(id));
    });
    dispatch(eventsActions.deleteAll());
  }, [dispatch]);

  useEffect(() => {
    if (active) {
      injectDemoData();
      intervalRef.current = setInterval(updateMovement, 3000);
    } else {
      cleanupDemo();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [active, injectDemoData, updateMovement, cleanupDemo]);

  return null;
};

export { DEMO_DEVICE_IDS };
export default DemoController;
