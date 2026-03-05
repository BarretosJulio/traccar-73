import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Menu,
  MenuItem,
  Typography,
  Badge,
} from '@mui/material';

import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import MapIcon from '@mui/icons-material/Map';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { sessionActions } from '../../store';
import { useTranslation } from './LocalizationProvider';
import { useRestriction } from '../util/permissions';
import { nativePostMessage } from './NativeInterface';
import { apiUrl } from '../util/apiUrl';

const NavItem = ({ icon, label, active, badge, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '3px',
      cursor: 'pointer',
      flex: 1,
      py: 0.8,
      position: 'relative',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }}
  >
    {/* Glow pill behind active icon */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: active ? 48 : 36,
        height: active ? 30 : 28,
        borderRadius: '14px',
        background: active
          ? 'linear-gradient(135deg, rgba(45,212,191,0.25) 0%, rgba(20,184,166,0.15) 100%)'
          : 'transparent',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '& .MuiSvgIcon-root': {
          fontSize: active ? '1.3rem' : '1.2rem',
          color: active ? '#2dd4bf' : 'rgba(255,255,255,0.4)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          filter: active ? 'drop-shadow(0 0 8px rgba(45,212,191,0.5))' : 'none',
        },
      }}
    >
      {badge ? (
        <Badge color="error" variant="dot" overlap="circular" invisible={!badge}>
          {icon}
        </Badge>
      ) : icon}
    </Box>
    <Typography
      sx={{
        fontSize: '0.6rem',
        fontWeight: active ? 700 : 500,
        color: active ? '#2dd4bf' : 'rgba(255,255,255,0.35)',
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        transition: 'all 0.3s ease',
        lineHeight: 1,
      }}
    >
      {label}
    </Typography>
    {/* Active indicator dot */}
    <Box
      sx={{
        width: 4,
        height: 4,
        borderRadius: '50%',
        background: active ? '#2dd4bf' : 'transparent',
        boxShadow: active ? '0 0 8px rgba(45,212,191,0.6)' : 'none',
        transition: 'all 0.3s ease',
        position: 'absolute',
        bottom: 2,
      }}
    />
  </Box>
);

const BottomMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const t = useTranslation();

  const readonly = useRestriction('readonly');
  const disableReports = useRestriction('disableReports');
  const devices = useSelector((state) => state.devices.items);
  const user = useSelector((state) => state.session.user);
  const socket = useSelector((state) => state.session.socket);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const [anchorEl, setAnchorEl] = useState(null);

  const currentSelection = () => {
    if (location.pathname === `/settings/user/${user.id}`) {
      return 'account';
    }
    if (location.pathname.startsWith('/settings')) {
      return 'settings';
    }
    if (location.pathname.startsWith('/reports')) {
      return 'reports';
    }
    if (location.pathname === '/' || location.pathname === '/map') {
      return 'map';
    }
    return null;
  };

  const handleAccount = () => {
    setAnchorEl(null);
    navigate(`/settings/user/${user.id}`);
  };

  const handleLogout = async () => {
    setAnchorEl(null);

    const notificationToken = window.localStorage.getItem('notificationToken');
    if (notificationToken && !user.readonly) {
      window.localStorage.removeItem('notificationToken');
      const tokens = user.attributes.notificationTokens?.split(',') || [];
      if (tokens.includes(notificationToken)) {
        const updatedUser = {
          ...user,
          attributes: {
            ...user.attributes,
            notificationTokens:
              tokens.length > 1
                ? tokens.filter((it) => it !== notificationToken).join(',')
                : undefined,
          },
        };
        await fetch(apiUrl(`/api/users/${user.id}`), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser),
        });
      }
    }

    await fetch(apiUrl('/api/session'), { method: 'DELETE' });
    nativePostMessage('logout');
    navigate('/login');
    dispatch(sessionActions.updateUser(null));
  };

  const handleNav = (value, event) => {
    switch (value) {
      case 'map':
        navigate('/map');
        break;
      case 'reports': {
        let id = selectedDeviceId;
        if (id == null) {
          const deviceIds = Object.keys(devices);
          if (deviceIds.length === 1) {
            id = deviceIds[0];
          }
        }
        navigate(id != null ? `/reports/combined?deviceId=${id}` : '/reports/combined');
        break;
      }
      case 'settings':
        navigate('/settings/preferences?menu=true');
        break;
      case 'account':
        setAnchorEl(event?.currentTarget);
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const active = currentSelection();

  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, rgba(15,23,32,0.95) 0%, rgba(10,16,24,0.98) 100%)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(45,212,191,0.08)',
        pb: 'env(safe-area-inset-bottom)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(45,212,191,0.15), transparent)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          maxWidth: 420,
          mx: 'auto',
          py: 0.5,
        }}
      >
        <NavItem
          icon={<MapIcon />}
          label={t('mapTitle')}
          active={active === 'map'}
          badge={socket === false}
          onClick={() => handleNav('map')}
        />
        {!disableReports && (
          <NavItem
            icon={<DescriptionIcon />}
            label={t('reportTitle')}
            active={active === 'reports'}
            onClick={() => handleNav('reports')}
          />
        )}
        <NavItem
          icon={<SettingsIcon />}
          label={t('settingsTitle')}
          active={active === 'settings'}
          onClick={() => handleNav('settings')}
        />
        {readonly ? (
          <NavItem
            icon={<ExitToAppIcon />}
            label={t('loginLogout')}
            active={false}
            onClick={() => handleNav('logout')}
          />
        ) : (
          <NavItem
            icon={<PersonIcon />}
            label={t('settingsUser')}
            active={active === 'account'}
            onClick={(e) => handleNav('account', e)}
          />
        )}
      </Box>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={handleAccount}>
          <Typography color="textPrimary">{t('settingsUser')}</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Typography color="error">{t('loginLogout')}</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default BottomMenu;
