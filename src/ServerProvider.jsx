import { useState } from 'react';
import { Alert, IconButton } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useEffectAsync } from './reactHelper';
import { sessionActions } from './store';
import Loader from './common/components/Loader';
import { apiUrl } from './common/util/apiUrl';

// Routes that don't need the Traccar server to be loaded
const PUBLIC_ROUTES = ['/', '/landing'];

const ServerProvider = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const initialized = useSelector((state) => !!state.session.server);
  const [error, setError] = useState(null);

  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

  useEffectAsync(async () => {
    if (!error && !isPublicRoute) {
      try {
        const tenantSlug = localStorage.getItem('tenantSlug') || 'mabtracker';
        const response = await fetch(apiUrl('/api/server'), {
          headers: { 'x-tenant-slug': tenantSlug },
        });
        if (response.ok) {
          dispatch(sessionActions.updateServer(await response.json()));
        } else {
          const message = await response.text();
          throw Error(message || response.statusText);
        }
      } catch (error) {
        setError(error.message);
      }
    }
  }, [error, isPublicRoute]);

  // Public routes render immediately without waiting for server
  if (isPublicRoute) {
    return children;
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <IconButton color="inherit" size="small" onClick={() => setError(null)}>
            <ReplayIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {error}
      </Alert>
    );
  }
  if (!initialized) {
    return <Loader />;
  }
  return children;
};

export default ServerProvider;
