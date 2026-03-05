import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
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
import { useTranslation } from '../common/components/LocalizationProvider';
import { useAdministrator } from '../common/util/permissions';
import BottomMenu from '../common/components/BottomMenu';
import { mapIconKey, mapIcons } from '../map/core/preloadImages';

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
    background: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  greeting: {
    fontWeight: 700,
    fontSize: '1.5rem',
    color: theme.palette.text.primary,
  },
  mapButton: {
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    color: '#fff',
    borderRadius: 14,
    padding: theme.spacing(1, 2.5),
    fontWeight: 600,
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    cursor: 'pointer',
    border: 'none',
    boxShadow: `0 4px 14px ${theme.palette.primary.main}40`,
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: `0 6px 20px ${theme.palette.primary.main}50`,
    },
  },
  content: {
    flex: 1,
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    maxWidth: 1400,
    width: '100%',
    margin: '0 auto',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: theme.spacing(2),
  },
  statCard: {
    borderRadius: 18,
    padding: theme.spacing(2.5),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
    },
  },
  statIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 800,
    lineHeight: 1,
  },
  statLabel: {
    fontSize: '0.8rem',
    fontWeight: 500,
    color: theme.palette.text.secondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontWeight: 700,
    fontSize: '1.1rem',
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1),
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: theme.spacing(2),
  },
  menuCard: {
    borderRadius: 16,
    border: `1px solid ${theme.palette.divider}`,
    overflow: 'hidden',
  },
  recentList: {
    borderRadius: 16,
    border: `1px solid ${theme.palette.divider}`,
    overflow: 'hidden',
  },
  deviceChip: {
    borderRadius: 10,
    fontWeight: 600,
    fontSize: '0.75rem',
  },
  footer: {
    '@media print': {
      display: 'none',
    },
  },
}));

const DashboardPage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const t = useTranslation();
  const admin = useAdministrator();

  const user = useSelector((state) => state.session.user);
  const devices = useSelector((state) => state.devices.items);
  const positions = useSelector((state) => state.session.positions);

  const deviceStats = useMemo(() => {
    const allDevices = Object.values(devices);
    const online = allDevices.filter((d) => d.status === 'online');
    const offline = allDevices.filter((d) => d.status === 'offline');
    const disabled = allDevices.filter((d) => d.disabled);
    return {
      total: allDevices.length,
      online: online.length,
      offline: offline.length,
      blocked: disabled.length,
      devices: allDevices,
    };
  }, [devices]);

  const stats = [
    {
      label: 'Total de Veículos',
      value: deviceStats.total,
      icon: <DirectionsCarIcon sx={{ fontSize: 28, color: '#fff' }} />,
      bg: 'linear-gradient(135deg, #6366f1, #818cf8)',
      color: '#6366f1',
    },
    {
      label: 'Online',
      value: deviceStats.online,
      icon: <WifiIcon sx={{ fontSize: 28, color: '#fff' }} />,
      bg: 'linear-gradient(135deg, #10b981, #34d399)',
      color: '#10b981',
    },
    {
      label: 'Offline',
      value: deviceStats.offline,
      icon: <WifiOffIcon sx={{ fontSize: 28, color: '#fff' }} />,
      bg: 'linear-gradient(135deg, #ef4444, #f87171)',
      color: '#ef4444',
    },
    {
      label: 'Bloqueados',
      value: deviceStats.blocked,
      icon: <BlockIcon sx={{ fontSize: 28, color: '#fff' }} />,
      bg: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      color: '#f59e0b',
    },
  ];

  const menuItems = [
    { label: t('deviceTitle'), icon: <DevicesIcon />, path: '/settings/devices', show: true },
    { label: t('settingsGroups'), icon: <GroupsIcon />, path: '/settings/groups', show: true },
    { label: t('sharedDrivers'), icon: <PersonIcon />, path: '/settings/drivers', show: true },
    { label: t('sharedGeofences'), icon: <FenceIcon />, path: '/geofences', show: true },
    { label: t('sharedNotifications'), icon: <NotificationsIcon />, path: '/settings/notifications', show: true },
    { label: t('sharedCalendars'), icon: <EventIcon />, path: '/settings/calendars', show: true },
    { label: t('sharedComputedAttributes'), icon: <TuneIcon />, path: '/settings/attributes', show: true },
    { label: t('sharedMaintenance'), icon: <BuildIcon />, path: '/settings/maintenances', show: true },
    { label: t('sharedPreferences'), icon: <SettingsIcon />, path: '/settings/preferences', show: true },
    { label: t('settingsUsers'), icon: <PeopleIcon />, path: '/settings/users', show: admin },
    { label: t('settingsServer'), icon: <StorageIcon />, path: '/settings/server', show: admin },
    { label: t('reportTitle'), icon: <DescriptionIcon />, path: '/reports/combined', show: true },
  ].filter((item) => item.show);

  const recentDevices = useMemo(() => {
    return [...deviceStats.devices]
      .sort((a, b) => {
        const posA = positions[a.id];
        const posB = positions[b.id];
        const timeA = posA?.fixTime || a.lastUpdate || '';
        const timeB = posB?.fixTime || b.lastUpdate || '';
        return timeB.localeCompare(timeA);
      })
      .slice(0, 8);
  }, [deviceStats.devices, positions]);

  return (
    <div className={classes.root}>
      <div className={classes.topBar}>
        <div>
          <Typography className={classes.greeting}>Dashboard</Typography>
          <Typography variant="body2" color="textSecondary">
            {user?.name ? `Olá, ${user.name}` : 'Painel de controle'}
          </Typography>
        </div>
        <button className={classes.mapButton} onClick={() => navigate('/map')}>
          <MapIcon fontSize="small" />
          Ver Mapa Geral
        </button>
      </div>

      <div className={classes.content}>
        {/* Stats Cards */}
        <div className={classes.statsGrid}>
          {stats.map((stat) => (
            <Paper key={stat.label} className={classes.statCard} elevation={0}>
              <Box className={classes.statIcon} sx={{ background: stat.bg }}>
                {stat.icon}
              </Box>
              <div>
                <Typography className={classes.statNumber} sx={{ color: stat.color }}>
                  {stat.value}
                </Typography>
                <Typography className={classes.statLabel}>{stat.label}</Typography>
              </div>
            </Paper>
          ))}
        </div>

        {/* Recent Devices */}
        <div>
          <Typography className={classes.sectionTitle}>Últimos Veículos Atualizados</Typography>
          <Paper className={classes.recentList} elevation={0}>
            <List disablePadding>
              {recentDevices.map((device, idx) => {
                const position = positions[device.id];
                const statusColors = { online: '#10b981', offline: '#ef4444', unknown: '#94a3b8' };
                const statusLabels = { online: 'Online', offline: 'Offline', unknown: 'Desconhecido' };
                return (
                  <Box key={device.id}>
                    <ListItemButton onClick={() => navigate(`/settings/device/${device.id}`)} sx={{ py: 1.5, px: 2 }}>
                      <ListItemIcon>
                        <Avatar sx={{ width: 38, height: 38, borderRadius: '10px', bgcolor: (statusColors[device.status] || '#94a3b8') + '18' }}>
                          <img src={mapIcons[mapIconKey(device.category)]} alt="" style={{ width: 20, height: 20, filter: 'brightness(0) invert(0.4)' }} />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={device.name}
                        secondary={position?.address || device.uniqueId}
                        slotProps={{
                          primary: { sx: { fontWeight: 600, fontSize: '0.875rem' } },
                          secondary: { sx: { fontSize: '0.75rem' }, noWrap: true },
                        }}
                      />
                      <Chip label={statusLabels[device.status] || 'N/A'} size="small" className={classes.deviceChip}
                        sx={{ bgcolor: (statusColors[device.status] || '#94a3b8') + '18', color: statusColors[device.status] || '#94a3b8' }} />
                      {device.disabled && (
                        <Chip label="Bloqueado" size="small" className={classes.deviceChip} sx={{ bgcolor: '#f59e0b18', color: '#f59e0b', ml: 1 }} />
                      )}
                    </ListItemButton>
                    {idx < recentDevices.length - 1 && <Divider />}
                  </Box>
                );
              })}
              {recentDevices.length === 0 && (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography color="textSecondary">Nenhum veículo encontrado</Typography>
                </Box>
              )}
            </List>
          </Paper>
        </div>

        {/* Config Menu */}
        <div>
          <Typography className={classes.sectionTitle}>Configurações</Typography>
          <div className={classes.menuGrid}>
            {menuItems.map((item) => (
              <Paper key={item.label} className={classes.menuCard} elevation={0}>
                <ListItemButton onClick={() => navigate(item.path)} sx={{ py: 2, px: 2.5 }}>
                  <ListItemIcon sx={{ minWidth: 42, color: 'primary.main' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontWeight: 600, fontSize: '0.875rem' } } }} />
                </ListItemButton>
              </Paper>
            ))}
          </div>
        </div>
      </div>

      <div className={classes.footer}>
        <BottomMenu />
      </div>
    </div>
  );
};

export default DashboardPage;
