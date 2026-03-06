import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Collapse,
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import BlockIcon from '@mui/icons-material/Block';
import DevicesIcon from '@mui/icons-material/Devices';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DescriptionIcon from '@mui/icons-material/Description';
import BuildIcon from '@mui/icons-material/Build';
import FenceIcon from '@mui/icons-material/Fence';
import PersonIcon from '@mui/icons-material/Person';
import TuneIcon from '@mui/icons-material/Tune';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import StorageIcon from '@mui/icons-material/Storage';
import SpeedIcon from '@mui/icons-material/Speed';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import NavigationIcon from '@mui/icons-material/Navigation';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ScienceIcon from '@mui/icons-material/Science';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import Battery60Icon from '@mui/icons-material/Battery60';
import Battery20Icon from '@mui/icons-material/Battery20';
import PowerIcon from '@mui/icons-material/Power';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import NightlightIcon from '@mui/icons-material/Nightlight';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useAdministrator } from '../common/util/permissions';
import BottomMenu from '../common/components/BottomMenu';
import { mapIconKey, mapIcons } from '../map/core/preloadImages';
import { devicesActions } from '../store';
import { useDispatch } from 'react-redux';
import { useThemeMode } from '../AppThemeProvider';

dayjs.extend(relativeTime);

const useStyles = makeStyles()((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: theme.palette.background.default,
    overflow: 'auto',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5, 2),
    },
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -50,
      right: -50,
      width: 200,
      height: 200,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.05)',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -30,
      left: '30%',
      width: 120,
      height: 120,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.03)',
    },
  },
  greeting: {
    fontWeight: 800,
    fontSize: '1.6rem',
    color: '#fff',
    letterSpacing: '-0.02em',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.15rem',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '55vw',
    },
  },
  subtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: '0.85rem',
    fontWeight: 400,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.7rem',
    },
  },
  subtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: '0.85rem',
    fontWeight: 400,
  },
  mapButton: {
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    color: '#fff',
    borderRadius: 14,
    padding: theme.spacing(1.2, 3),
    fontWeight: 700,
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.25)',
    transition: 'all 0.25s ease',
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.8, 1.5),
      fontSize: '0.75rem',
      borderRadius: 10,
    },
    '&:hover': {
      background: 'rgba(255,255,255,0.25)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
    },
  },
  content: {
    flex: 1,
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2, 1.5),
    },
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(2),
    },
    maxWidth: 1400,
    width: '100%',
    margin: '0 auto',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: theme.spacing(1),
      marginTop: theme.spacing(-3),
    },
    gap: theme.spacing(2),
    marginTop: theme.spacing(-5),
    position: 'relative',
    zIndex: 2,
  },
  statCard: {
    borderRadius: 20,
    padding: theme.spacing(2.5),
    [theme.breakpoints.down('sm')]: {
      borderRadius: 12,
      padding: theme.spacing(1.2),
      gap: theme.spacing(0.8),
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: `1px solid ${theme.palette.divider}`,
    background: theme.palette.background.paper,
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-4px) scale(1.02)',
      boxShadow: '0 12px 35px rgba(0,0,0,0.12)',
    },
  },
  statCardActive: {
    borderWidth: 2,
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    [theme.breakpoints.down('sm')]: {
      width: 34,
      height: 34,
      borderRadius: 10,
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statNumber: {
    fontSize: '2.2rem',
    fontWeight: 900,
    lineHeight: 1,
    letterSpacing: '-0.03em',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.2rem',
    },
  },
  statLabel: {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: theme.palette.text.secondary,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.65rem',
      marginTop: 2,
    },
  },
  statPercent: {
    fontSize: '0.7rem',
    fontWeight: 700,
    marginTop: 2,
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#10b981',
    animation: 'pulse 2s infinite',
  },
  '@keyframes pulse': {
    '0%': { opacity: 1, transform: 'scale(1)' },
    '50%': { opacity: 0.5, transform: 'scale(1.3)' },
    '100%': { opacity: 1, transform: 'scale(1)' },
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: theme.spacing(1),
    },
  },
  sectionTitle: {
    fontWeight: 800,
    fontSize: '1.1rem',
    color: theme.palette.text.primary,
    letterSpacing: '-0.01em',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.95rem',
    },
  },
  filterChips: {
    display: 'flex',
    gap: theme.spacing(0.5),
    flexWrap: 'wrap',
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(0.5),
    },
  },
  filterChip: {
    borderRadius: 10,
    fontWeight: 600,
    fontSize: '0.72rem',
    height: 28,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    [theme.breakpoints.down('sm')]: {
      height: 24,
      fontSize: '0.65rem',
    },
  },
  vehicleCard: {
    borderRadius: 16,
    border: `1px solid ${theme.palette.divider}`,
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    [theme.breakpoints.down('sm')]: {
      borderRadius: 12,
    },
    '&:hover': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 1px ${theme.palette.primary.main}20`,
    },
  },
  vehicleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(1.5, 2),
  },
  vehicleInfo: {
    flex: 1,
    minWidth: 0,
  },
  vehicleMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    flexShrink: 0,
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(0.8),
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
      maxWidth: '45%',
    },
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: '0.72rem',
    color: theme.palette.text.secondary,
    fontWeight: 500,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.62rem',
      gap: 2,
    },
  },
  speedBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    padding: '3px 10px',
    borderRadius: 8,
    fontSize: '0.72rem',
    fontWeight: 700,
    [theme.breakpoints.down('sm')]: {
      padding: '2px 6px',
      fontSize: '0.62rem',
      borderRadius: 6,
    },
  },
  menuGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing(3),
    padding: theme.spacing(1, 0),
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(1.5),
      justifyContent: 'space-between',
    },
  },
  menuItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(0.8),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: 85,
    [theme.breakpoints.down('sm')]: {
      width: 62,
      gap: theme.spacing(0.5),
    },
    '&:hover': {
      transform: 'translateY(-2px)',
      '& $menuIcon': {
        boxShadow: `0 4px 14px ${theme.palette.primary.main}40`,
      },
    },
  },
  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.primary.main,
    background: `${theme.palette.primary.main}14`,
    transition: 'all 0.2s ease',
    [theme.breakpoints.down('sm')]: {
      width: 36,
      height: 36,
      borderRadius: 10,
    },
  },
  menuLabel: {
    fontSize: '0.68rem',
    fontWeight: 600,
    color: theme.palette.text.secondary,
    textAlign: 'center',
    lineHeight: 1.2,
    width: '100%',
    wordBreak: 'break-word',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.58rem',
    },
  },
  footer: {
    '@media print': {
      display: 'none',
    },
  },
  emptyState: {
    padding: theme.spacing(6),
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3),
    },
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      height: 3,
      marginTop: theme.spacing(0.5),
    },
  },
}));

const DashboardPage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();
  const admin = useAdministrator();
  const { demoMode, setDemoMode } = useOutletContext() || {};
  const { darkMode, toggleDarkMode } = useThemeMode();

  const user = useSelector((state) => state.session.user);
  const devices = useSelector((state) => state.devices.items);
  const positions = useSelector((state) => state.session.positions);
  const socket = useSelector((state) => state.session.socket);

  const [activeFilter, setActiveFilter] = useState('all');
  const [showAllDevices, setShowAllDevices] = useState(false);

  const deviceStats = useMemo(() => {
    const allDevices = Object.values(devices);
    const online = allDevices.filter((d) => d.status === 'online');
    const offline = allDevices.filter((d) => d.status === 'offline');
    const disabled = allDevices.filter((d) => d.disabled);
    const moving = allDevices.filter((d) => {
      const pos = positions[d.id];
      return pos && (pos.speed || 0) * 1.852 > 1;
    });
    return {
      total: allDevices.length,
      online: online.length,
      offline: offline.length,
      blocked: disabled.length,
      moving: moving.length,
      devices: allDevices,
    };
  }, [devices, positions]);

  const filteredDevices = useMemo(() => {
    let list = [...deviceStats.devices];
    if (activeFilter === 'online') list = list.filter((d) => d.status === 'online');
    else if (activeFilter === 'offline') list = list.filter((d) => d.status === 'offline');
    else if (activeFilter === 'blocked') list = list.filter((d) => d.disabled);
    else if (activeFilter === 'moving') {
      list = list.filter((d) => {
        const pos = positions[d.id];
        return pos && (pos.speed || 0) * 1.852 > 1;
      });
    }
    return list
      .sort((a, b) => {
        const posA = positions[a.id];
        const posB = positions[b.id];
        const timeA = posA?.fixTime || a.lastUpdate || '';
        const timeB = posB?.fixTime || b.lastUpdate || '';
        return timeB.localeCompare(timeA);
      });
  }, [deviceStats.devices, positions, activeFilter]);

  const displayDevices = showAllDevices ? filteredDevices : filteredDevices.slice(0, 10);

  const stats = [
    {
      key: 'all',
      label: t('sharedTotal'),
      value: deviceStats.total,
      icon: <DirectionsCarIcon sx={{ fontSize: 26, color: '#fff' }} />,
      bg: 'linear-gradient(135deg, #6366f1, #818cf8)',
      color: '#6366f1',
      light: '#6366f118',
    },
    {
      key: 'online',
      label: 'Online',
      value: deviceStats.online,
      icon: <WifiIcon sx={{ fontSize: 26, color: '#fff' }} />,
      bg: 'linear-gradient(135deg, #10b981, #34d399)',
      color: '#10b981',
      light: '#10b98118',
      percent: deviceStats.total ? Math.round((deviceStats.online / deviceStats.total) * 100) : 0,
    },
    {
      key: 'offline',
      label: 'Offline',
      value: deviceStats.offline,
      icon: <WifiOffIcon sx={{ fontSize: 26, color: '#fff' }} />,
      bg: 'linear-gradient(135deg, #ef4444, #f87171)',
      color: '#ef4444',
      light: '#ef444418',
      percent: deviceStats.total ? Math.round((deviceStats.offline / deviceStats.total) * 100) : 0,
    },
    {
      key: 'blocked',
      label: t('statusBlocked'),
      value: deviceStats.blocked,
      icon: <BlockIcon sx={{ fontSize: 26, color: '#fff' }} />,
      bg: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      color: '#f59e0b',
      light: '#f59e0b18',
    },
    {
      key: 'moving',
      label: t('statusMoving'),
      value: deviceStats.moving,
      icon: <TrendingUpIcon sx={{ fontSize: 26, color: '#fff' }} />,
      bg: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
      color: '#3b82f6',
      light: '#3b82f618',
    },
  ];

  const menuItems = [
    { label: t('deviceTitle'), icon: <DevicesIcon />, path: '/app/settings/devices', show: true },
    { label: t('settingsGroups'), icon: <GroupsIcon />, path: '/app/settings/groups', show: true },
    { label: t('sharedDrivers'), icon: <PersonIcon />, path: '/app/settings/drivers', show: true },
    { label: t('sharedGeofences'), icon: <FenceIcon />, path: '/app/geofences', show: true },
    { label: t('sharedNotifications'), icon: <NotificationsIcon />, path: '/app/settings/notifications', show: true },
    { label: t('sharedMaintenance'), icon: <BuildIcon />, path: '/app/settings/maintenances', show: true },
    { label: t('sharedPreferences'), icon: <SettingsIcon />, path: '/app/settings/preferences', show: true },
    { label: t('reportTitle'), icon: <DescriptionIcon />, path: '/app/reports/combined', show: true },
    { label: t('settingsUsers'), icon: <PeopleIcon />, path: '/app/settings/users', show: admin },
    { label: t('settingsServer'), icon: <StorageIcon />, path: '/app/settings/server', show: admin },
  ].filter((item) => item.show);

  const getSpeedKmh = (deviceId) => {
    const pos = positions[deviceId];
    return pos ? Math.round((pos.speed || 0) * 1.852) : 0;
  };

  const getLastUpdate = (device) => {
    const pos = positions[device.id];
    const time = pos?.fixTime || device.lastUpdate;
    return time ? dayjs(time).fromNow() : '—';
  };

  const statusColors = { online: '#10b981', offline: '#ef4444', unknown: '#94a3b8' };
  const statusLabels = { online: 'Online', offline: 'Offline', unknown: 'N/A' };

  return (
    <div className={classes.root}>
      {/* Hero Top Bar */}
      <div className={classes.topBar}>
        <div style={{ zIndex: 1 }}>
          <Box className={classes.liveIndicator}>
            <Box className={classes.liveDot}
              sx={{
                '@keyframes pulse': {
                  '0%': { opacity: 1, transform: 'scale(1)' },
                  '50%': { opacity: 0.5, transform: 'scale(1.5)' },
                  '100%': { opacity: 1, transform: 'scale(1)' },
                },
                animation: 'pulse 2s infinite',
              }}
            />
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {socket ? t('dashboardRealTime') : t('dashboardDisconnected')}
            </Typography>
          </Box>
          <Typography className={classes.greeting}>
            {user?.name ? t('dashboardGreeting').replace('{0}', user.name) : t('dashboardTitle')}
          </Typography>
          <Typography className={classes.subtitle}>
            {deviceStats.total > 0
              ? t('dashboardFleetStatus').replace('{0}', deviceStats.online).replace('{1}', deviceStats.total).replace('{2}', deviceStats.moving)
              : t('dashboardFleetPanel')}
          </Typography>
        </div>
        <Box sx={{ display: 'flex', gap: 1, zIndex: 1, alignItems: 'center' }}>
          <Tooltip title={darkMode ? t('dashboardLightMode') : t('dashboardDarkMode')}>
            <IconButton
              onClick={toggleDarkMode}
              sx={{
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                borderRadius: 3,
                border: '1px solid rgba(255,255,255,0.25)',
                '&:hover': { background: 'rgba(255,255,255,0.25)' },
              }}
            >
              {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          {admin && (
            <Tooltip title={demoMode ? t('dashboardDemoDisable') : t('dashboardDemoEnable')}>
              <IconButton
                onClick={() => setDemoMode?.(!demoMode)}
                sx={{
                  background: demoMode ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  borderRadius: 3,
                  border: demoMode ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.25)',
                  '&:hover': { background: demoMode ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.25)' },
                }}
              >
                <ScienceIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </div>

      {demoMode && (
        <Box sx={{
          mx: 3, mt: -0.5, mb: 0, px: 1.5, py: 0.5, borderRadius: 2,
          background: 'rgba(245,158,11,0.15)',
          border: '1px solid rgba(245,158,11,0.3)',
          display: 'flex', alignItems: 'center', gap: 1,
        }}>
          <ScienceIcon sx={{ color: '#f59e0b', fontSize: 14 }} />
          <Typography sx={{ color: '#fbbf24', fontWeight: 600, fontSize: '0.7rem', flex: 1 }}>
            {t('dashboardDemoActive')}
          </Typography>
          <Chip
            label={t('dashboardExit')}
            size="small"
            onClick={() => setDemoMode?.(false)}
            sx={{ height: 20, fontSize: '0.6rem', bgcolor: 'rgba(245,158,11,0.2)', color: '#fbbf24', fontWeight: 700, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(245,158,11,0.35)' } }}
          />
        </Box>
      )}

      <div className={classes.content}>
        {/* Stats Cards - Elevated over top bar */}
        <div className={classes.statsGrid}>
          {stats.map((stat) => (
            <Paper
              key={stat.key}
              className={`${classes.statCard} ${activeFilter === stat.key ? classes.statCardActive : ''}`}
              elevation={0}
              onClick={() => setActiveFilter(stat.key === activeFilter ? 'all' : stat.key)}
              sx={activeFilter === stat.key ? { borderColor: stat.color } : {}}
            >
              <Box className={classes.statIcon} sx={{ background: stat.bg }}>
                {stat.icon}
              </Box>
              <div style={{ flex: 1 }}>
                <Typography className={classes.statNumber} sx={{ color: stat.color }}>
                  {stat.value}
                </Typography>
                <Typography className={classes.statLabel}>{stat.label}</Typography>
                {stat.percent !== undefined && deviceStats.total > 0 && (
                  <LinearProgress
                    variant="determinate"
                    value={stat.percent}
                    className={classes.progressBar}
                    sx={{
                      bgcolor: stat.light,
                      '& .MuiLinearProgress-bar': { bgcolor: stat.color, borderRadius: 2 },
                    }}
                  />
                )}
              </div>
            </Paper>
          ))}
        </div>

        {/* Vehicle List */}
        <div>
          <Box className={classes.sectionHeader}>
            <Box>
              <Typography className={classes.sectionTitle}>
                {t('sharedVehicles')}
                <Chip
                  label={filteredDevices.length}
                  size="small"
                  sx={{ ml: 1, height: 22, fontSize: '0.7rem', fontWeight: 700, bgcolor: 'primary.main', color: '#fff' }}
                />
              </Typography>
            </Box>
            <Box className={classes.filterChips}>
              {['all', 'online', 'offline', 'moving', 'blocked'].map((key) => {
                const labels = { all: t('sharedAll'), online: 'Online', offline: 'Offline', moving: t('statusMoving'), blocked: t('statusBlocked') };
                const colors = { all: '#6366f1', online: '#10b981', offline: '#ef4444', moving: '#3b82f6', blocked: '#f59e0b' };
                return (
                  <Chip
                    key={key}
                    label={labels[key]}
                    size="small"
                    className={classes.filterChip}
                    onClick={() => setActiveFilter(key)}
                    sx={{
                      bgcolor: activeFilter === key ? colors[key] + '20' : 'transparent',
                      color: activeFilter === key ? colors[key] : 'text.secondary',
                      border: `1px solid ${activeFilter === key ? colors[key] : 'transparent'}`,
                      '&:hover': { bgcolor: colors[key] + '10' },
                    }}
                  />
                );
              })}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1.5 }}>
            {displayDevices.map((device) => {
              const position = positions[device.id];
              const attrs = position?.attributes || {};
              const speed = getSpeedKmh(device.id);
              const isMoving = speed > 1;
              const statusColor = statusColors[device.status] || '#94a3b8';
              const batteryLevel = attrs.batteryLevel;
              const ignition = attrs.ignition;
              const blocked = attrs.blocked;
              const satellites = attrs.sat;
              const fuel = attrs.fuel;
              const course = position?.course;

              const handleClick = () => {
                dispatch(devicesActions.selectId(device.id));
                navigate('/app/map');
              };

              return (
                <Paper key={device.id} className={classes.vehicleCard} elevation={0}>
                    <ListItemButton
                      onClick={handleClick}
                      sx={{ py: { xs: 1, sm: 1.5 }, px: { xs: 1.2, sm: 2 }, gap: { xs: 1, sm: 1.5 }, flexWrap: 'wrap' }}
                    >
                      <Avatar
                        sx={{
                          width: { xs: 36, sm: 44 },
                          height: { xs: 36, sm: 44 },
                          borderRadius: { xs: '10px', sm: '14px' },
                          bgcolor: statusColor + '14',
                          border: `2px solid ${statusColor}30`,
                        }}
                      >
                      <img
                        src={mapIcons[mapIconKey(device.category)]}
                        alt=""
                        style={{ width: 22, height: 22, filter: 'brightness(0) invert(0.4)' }}
                      />
                    </Avatar>

                    <Box className={classes.vehicleInfo}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.78rem', sm: '0.9rem' } }} noWrap>
                            {device.name}
                          </Typography>
                        <Box
                          sx={{
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            bgcolor: statusColor,
                            flexShrink: 0,
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOnIcon sx={{ fontSize: 11, color: 'text.secondary', opacity: 0.5 }} />
                          <Typography sx={{ fontSize: { xs: '0.62rem', sm: '0.72rem' }, color: 'text.secondary' }} noWrap>
                            {position?.address || device.uniqueId}
                          </Typography>
                      </Box>
                    </Box>

                    <Box className={classes.vehicleMeta}>
                      {/* Ignition */}
                      {ignition !== undefined && (
                        <Tooltip title={ignition ? t('statusIgnitionOn') : t('statusIgnitionOff')}>
                          <Box className={classes.metaItem}>
                            {ignition
                              ? <PowerIcon sx={{ fontSize: 14, color: '#10b981' }} />
                              : <PowerOffIcon sx={{ fontSize: 14, color: '#94a3b8' }} />}
                          </Box>
                        </Tooltip>
                      )}

                      {/* Blocked */}
                      {blocked !== undefined && (
                        <Tooltip title={blocked ? 'Bloqueado' : 'Desbloqueado'}>
                          <Box className={classes.metaItem}>
                            {blocked
                              ? <LockIcon sx={{ fontSize: 14, color: '#ef4444' }} />
                              : <LockOpenIcon sx={{ fontSize: 14, color: '#10b981' }} />}
                          </Box>
                        </Tooltip>
                      )}

                      {/* Motion */}
                      {isMoving ? (
                        <Tooltip title="Em movimento">
                          <Box className={classes.metaItem}>
                            <DirectionsRunIcon sx={{ fontSize: 14, color: '#3b82f6' }} />
                          </Box>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Parado">
                          <Box className={classes.metaItem}>
                            <NightlightIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                          </Box>
                        </Tooltip>
                      )}

                      {/* Satellites */}
                      {satellites != null && (
                        <Tooltip title={`${satellites} satélites`}>
                          <Box className={classes.metaItem}>
                            <SignalCellularAltIcon sx={{ fontSize: 13 }} />
                            {satellites}
                          </Box>
                        </Tooltip>
                      )}

                      {/* Course */}
                      {course != null && (
                        <Tooltip title={`Direção: ${Math.round(course)}°`}>
                          <Box className={classes.metaItem}>
                            <NavigationIcon sx={{ fontSize: 13, transform: `rotate(${course}deg)` }} />
                          </Box>
                        </Tooltip>
                      )}

                      {/* Fuel */}
                      {fuel != null && (
                        <Tooltip title={`Combustível: ${Math.round(fuel)}%`}>
                          <Box className={classes.metaItem}>
                            <LocalGasStationIcon sx={{ fontSize: 13 }} />
                            {Math.round(fuel)}%
                          </Box>
                        </Tooltip>
                      )}

                      {/* Battery */}
                      {batteryLevel != null && (
                        <Tooltip title={`Bateria: ${Math.round(batteryLevel)}%`}>
                          <Box className={classes.metaItem} sx={{ color: batteryLevel > 70 ? '#10b981' : batteryLevel > 30 ? '#f59e0b' : '#ef4444' }}>
                            {batteryLevel > 70 ? <BatteryFullIcon sx={{ fontSize: 14 }} /> : batteryLevel > 30 ? <Battery60Icon sx={{ fontSize: 14 }} /> : <Battery20Icon sx={{ fontSize: 14 }} />}
                            {Math.round(batteryLevel)}%
                          </Box>
                        </Tooltip>
                      )}

                      {/* Speed */}
                      <Box
                        className={classes.speedBadge}
                        sx={{
                          bgcolor: isMoving ? '#3b82f618' : '#94a3b818',
                          color: isMoving ? '#3b82f6' : '#94a3b8',
                        }}
                      >
                        <SpeedIcon sx={{ fontSize: 14 }} />
                        {speed} km/h
                      </Box>

                      {/* Last update */}
                      <Tooltip title="Última atualização">
                        <Box className={classes.metaItem}>
                          <AccessTimeIcon sx={{ fontSize: 13 }} />
                          {getLastUpdate(device)}
                        </Box>
                      </Tooltip>

                      {/* Status chip */}
                      <Chip
                        label={statusLabels[device.status] || 'N/A'}
                        size="small"
                        sx={{
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.68rem',
                          height: 24,
                          bgcolor: statusColor + '18',
                          color: statusColor,
                        }}
                      />

                      {device.disabled && (
                        <Chip
                          icon={<BlockIcon sx={{ fontSize: 12 }} />}
                          label="Bloq."
                          size="small"
                          sx={{
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.68rem',
                            height: 24,
                            bgcolor: '#f59e0b18',
                            color: '#f59e0b',
                          }}
                        />
                      )}
                    </Box>
                  </ListItemButton>
                </Paper>
              );
            })}
            {filteredDevices.length === 0 && (
              <Paper elevation={0} className={classes.vehicleCard}>
                <Box className={classes.emptyState}>
                  <SignalCellularAltIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                  <Typography color="textSecondary" sx={{ fontWeight: 600 }}>
                    Nenhum veículo {activeFilter !== 'all' ? 'nesta categoria' : 'encontrado'}
                  </Typography>
                  {activeFilter !== 'all' && (
                    <Chip
                      label="Ver todos"
                      size="small"
                      onClick={() => setActiveFilter('all')}
                      sx={{ fontWeight: 600, cursor: 'pointer' }}
                    />
                  )}
                </Box>
              </Paper>
            )}

            {filteredDevices.length > 10 && (
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Chip
                  label={showAllDevices ? 'Mostrar menos' : `Ver todos (${filteredDevices.length})`}
                  icon={showAllDevices ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  onClick={() => setShowAllDevices(!showAllDevices)}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    bgcolor: 'primary.main',
                    color: '#fff',
                    '&:hover': { bgcolor: 'primary.dark' },
                    '& .MuiChip-icon': { color: '#fff' },
                  }}
                />
              </Box>
            )}
          </Box>
        </div>

        {/* Quick Actions Menu */}
        <div>
          <Typography className={classes.sectionTitle} sx={{ mb: 1.5 }}>Acesso Rápido</Typography>
          <div className={classes.menuGrid}>
            {menuItems.map((item) => (
              <div
                key={item.label}
                className={classes.menuItem}
                onClick={() => navigate(item.path)}
              >
                <div className={classes.menuIcon}>
                  {item.icon}
                </div>
                <span className={classes.menuLabel}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
};

export default DashboardPage;
