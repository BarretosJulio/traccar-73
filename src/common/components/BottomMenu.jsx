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
import { useTheme } from '@mui/material/styles';

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

const NavItem = ({ icon, label, active, badge, onClick, theme }) => (
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
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: active ? 48 : 36,
        height: active ? 30 : 28,
        borderRadius: '14px',
        background: active
          ? `linear-gradient(135deg, ${theme.palette.primary.main}40 0%, ${theme.palette.primary.main}26 100%)`
          : 'transparent',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '& .MuiSvgIcon-root': {
          fontSize: active ? '1.3rem' : '1.2rem',
          color: active ? theme.palette.primary.main : theme.palette.text.secondary,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          filter: active ? `drop-shadow(0 0 8px ${theme.palette.primary.main}80)` : 'none',
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
        color: active ? theme.palette.primary.main : theme.palette.text.disabled,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        transition: 'all 0.3s ease',
        lineHeight: 1,
      }}
    >
      {label}
    </Typography>
    <Box
      sx={{
        width: 4,
        height: 4,
        borderRadius: '50%',
        background: active ? theme.palette.primary.main : 'transparent',
        boxShadow: active ? `0 0 8px ${theme.palette.primary.main}99` : 'none',
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
  const theme = useTheme();

  const readonly = useRestriction('readonly');
  const disableReports = useRestriction('disableReports');
  const devices = useSelector((state) => state.devices.items);
  const user = useSelector((state) => state.session.user);
  const socket = useSelector((state) => state.session.socket);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const [anchorEl, setAnchorEl] = useState(null);

  const currentSelection = () => {
    if (location.pathname === `/app/settings/user/${user.id}`) {
      return 'account';
    }
    if (location.pathname.startsWith('/app/settings')) {
      return 'settings';
    }
    if (location.pathname.startsWith('/app/reports')) {
      return 'reports';
    }
    if (location.pathname === '/app' || location.pathname === '/app/map') {
      return 'map';
    }
    return null;
  };

  const handleAccount = () => {
    setAnchorEl(null);
    navigate(`/app/settings/user/${user.id}`);
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
        navigate('/app/map');
        break;
      case 'reports': {
        let id = selectedDeviceId;
        if (id == null) {
          const deviceIds = Object.keys(devices);
          if (deviceIds.length === 1) {
            id = deviceIds[0];
          }
        }
        navigate(id != null ? `/app/reports/combined?deviceId=${id}` : '/app/reports/combined');
        break;
      }
      case 'settings':
        navigate('/app/settings/preferences?menu=true');
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
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(180deg, ${theme.palette.background.paper}F2 0%, ${theme.palette.background.default}FA 100%)`
          : `linear-gradient(180deg, ${theme.palette.background.paper}F2 0%, ${theme.palette.background.default}FA 100%)`,
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${theme.palette.divider}`,
        pb: 'env(safe-area-inset-bottom)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}26, transparent)`,
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
          theme={theme}
        />
        {!disableReports && (
          <NavItem
            icon={<DescriptionIcon />}
            label={t('reportTitle')}
            active={active === 'reports'}
            onClick={() => handleNav('reports')}
            theme={theme}
          />
        )}
        <NavItem
          icon={<SettingsIcon />}
          label={t('settingsTitle')}
          active={active === 'settings'}
          onClick={() => handleNav('settings')}
          theme={theme}
        />
        {readonly ? (
          <NavItem
            icon={<ExitToAppIcon />}
            label={t('loginLogout')}
            active={false}
            onClick={() => handleNav('logout')}
            theme={theme}
          />
        ) : (
          <NavItem
            icon={<PersonIcon />}
            label={t('settingsUser')}
            active={active === 'account'}
            onClick={(e) => handleNav('account', e)}
            theme={theme}
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
