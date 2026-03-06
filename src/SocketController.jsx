import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector, connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Snackbar } from '@mui/material';
import { devicesActions, sessionActions } from './store';
import { useCatchCallback } from './reactHelper';
import { snackBarDurationLongMs } from './common/util/duration';
import alarm from './resources/alarm.mp3';
import { eventsActions } from './store/events';
import useFeatures from './common/util/useFeatures';
import { useAttributePreference } from './common/util/preferences';
import {
  handleNativeNotificationListeners,
  nativePostMessage,
} from './common/components/NativeInterface';
import fetchOrThrow from './common/util/fetchOrThrow';

const POLLING_INTERVAL = 5000; // 5 seconds

const SocketController = ({ demoMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authenticated = useSelector((state) => Boolean(state.session.user));

  const pollingRef = useRef(null);
  const lastEventIdRef = useRef(0);

  const [notifications, setNotifications] = useState([]);

  const soundEvents = useAttributePreference('soundEvents', '');
  const soundAlarms = useAttributePreference('soundAlarms', 'sos');

  const features = useFeatures();

  const handleEvents = useCallback(
    (events) => {
      if (!features.disableEvents) {
        dispatch(eventsActions.add(events));
      }
      if (
        events.some(
          (e) =>
            soundEvents.includes(e.type) ||
            (e.type === 'alarm' && soundAlarms.includes(e.attributes.alarm)),
        )
      ) {
        new Audio(alarm).play();
      }
      setNotifications(
        events.map((event) => ({
          id: event.id,
          message: event.attributes.message,
          show: true,
        })),
      );
    },
    [features, dispatch, soundEvents, soundAlarms],
  );

  const pollData = useCallback(async () => {
    try {
      const [devicesResponse, positionsResponse] = await Promise.all([
        fetchOrThrow('/api/devices'),
        fetchOrThrow('/api/positions'),
      ]);

      const devices = await devicesResponse.json();
      const positions = await positionsResponse.json();

      dispatch(devicesActions.update(devices));
      dispatch(sessionActions.updatePositions(positions));
      dispatch(sessionActions.updateSocket(true));
    } catch (error) {
      dispatch(sessionActions.updateSocket(false));
      if (error.message?.includes('401')) {
        navigate('/login');
        return;
      }
    }
  }, [dispatch, navigate]);

  // Start polling when authenticated (skip in demo mode)
  useEffect(() => {
    if (authenticated && !demoMode) {
      const initialFetch = async () => {
        try {
          const response = await fetchOrThrow('/api/devices');
          dispatch(devicesActions.refresh(await response.json()));
          nativePostMessage('authenticated');
          dispatch(sessionActions.updateSocket(true));
        } catch (error) {
          console.error('Initial device fetch failed:', error);
        }
      };

      initialFetch();
      pollingRef.current = setInterval(pollData, POLLING_INTERVAL);

      return () => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
        dispatch(sessionActions.updateSocket(false));
      };
    }
    if (demoMode && authenticated) {
      dispatch(sessionActions.updateSocket(true));
    }
    return undefined;
  }, [authenticated, demoMode, pollData, dispatch]);

  // Reconnect on visibility change
  useEffect(() => {
    if (!authenticated || demoMode) return undefined;
    const onVisibility = () => {
      if (!document.hidden && !pollingRef.current) {
        pollData();
        pollingRef.current = setInterval(pollData, POLLING_INTERVAL);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [authenticated, demoMode, pollData]);

  const handleNativeNotification = useCatchCallback(
    async (message) => {
      const eventId = message.data.eventId;
      if (eventId) {
        const response = await fetchOrThrow(`/api/events/${eventId}`);
        if (response.ok) {
          const event = await response.json();
          const eventWithMessage = {
            ...event,
            attributes: { ...event.attributes, message: message.notification.body },
          };
          handleEvents([eventWithMessage]);
        }
      }
    },
    [handleEvents],
  );

  useEffect(() => {
    handleNativeNotificationListeners.add(handleNativeNotification);
    return () => handleNativeNotificationListeners.delete(handleNativeNotification);
  }, [handleNativeNotification]);

  return (
    <>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={notification.show}
          message={notification.message}
          autoHideDuration={snackBarDurationLongMs}
          onClose={() => setNotifications(notifications.filter((e) => e.id !== notification.id))}
        />
      ))}
    </>
  );
};

export default connect()(SocketController);
