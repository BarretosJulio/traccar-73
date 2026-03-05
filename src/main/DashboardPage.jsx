import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useAdministrator } from '../common/util/permissions';
import BottomMenu from '../common/components/BottomMenu';
import { mapIconKey, mapIcons } from '../map/core/preloadImages';

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
    '&:hover': {
      background: 'rgba(255,255,255,0.25)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing(2),
    marginTop: theme.spacing(-5),
    position: 'relative',
    zIndex: 2,
  },
  statCard: {
    borderRadius: 20,
    padding: theme.spacing(2.5),
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
  },
  statLabel: {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: theme.palette.text.secondary,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
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
  },
  sectionTitle: {
    fontWeight: 800,
    fontSize: '1.1rem',
    color: theme.palette.text.primary,
    letterSpacing: '-0.01em',
  },
  filterChips: {
    display: 'flex',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
  },
  filterChip: {
    borderRadius: 10,
    fontWeight: 600,
    fontSize: '0.72rem',
    height: 28,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  vehicleCard: {
    borderRadius: 16,
    border: `1px solid ${theme.palette.divider}`,
    overflow: 'hidden',
    transition: 'all 0.2s ease',
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
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: '0.72rem',
    color: theme.palette.text.secondary,
    fontWeight: 500,
  },
  speedBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    padding: '3px 10px',
    borderRadius: 8,
    fontSize: '0.72rem',
    fontWeight: 700,
  },
  menuGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing(3),
    padding: theme.spacing(1, 0),
  },
  menuItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(0.8),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: 85,
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
  },
  menuLabel: {
    fontSize: '0.68rem',
    fontWeight: 600,
    color: theme.palette.text.secondary,
    textAlign: 'center',
    lineHeight: 1.2,
    width: '100%',
    wordBreak: 'break-word',
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
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginTop: theme.spacing(1),
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
      label: 'Total',
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
      label: 'Bloqueados',
      value: deviceStats.blocked,
      icon: <BlockIcon sx={{ fontSize: 26, color: '#fff' }} />,
      bg: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      color: '#f59e0b',
      light: '#f59e0b18',
    },
    {
      key: 'moving',
      label: 'Em Movimento',
      value: deviceStats.moving,
      icon: <TrendingUpIcon sx={{ fontSize: 26, color: '#fff' }} />,
      bg: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
      color: '#3b82f6',
      light: '#3b82f618',
    },
  ];

  const menuItems = [
    { label: t('deviceTitle'), icon: <DevicesIcon />, path: '/settings/devices', show: true },
    { label: t('settingsGroups'), icon: <GroupsIcon />, path: '/settings/groups', show: true },
    { label: t('sharedDrivers'), icon: <PersonIcon />, path: '/settings/drivers', show: true },
    { label: 'Cercas', icon: <FenceIcon />, path: '/geofences', show: true },
    { label: t('sharedNotifications'), icon: <NotificationsIcon />, path: '/settings/notifications', show: true },
    { label: t('sharedMaintenance'), icon: <BuildIcon />, path: '/settings/maintenances', show: true },
    { label: t('sharedPreferences'), icon: <SettingsIcon />, path: '/settings/preferences', show: true },
    { label: t('reportTitle'), icon: <DescriptionIcon />, path: '/reports/combined', show: true },
    { label: t('settingsUsers'), icon: <PeopleIcon />, path: '/settings/users', show: admin },
    { label: t('settingsServer'), icon: <StorageIcon />, path: '/settings/server', show: admin },
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
              {socket ? 'Tempo Real' : 'Desconectado'}
            </Typography>
          </Box>
          <Typography className={classes.greeting}>
            {user?.name ? `Olá, ${user.name}` : 'Dashboard'}
          </Typography>
          <Typography className={classes.subtitle}>
            {deviceStats.total > 0
              ? `${deviceStats.online} de ${deviceStats.total} veículos online · ${deviceStats.moving} em movimento`
              : 'Painel de controle de frota'}
          </Typography>
        </div>
        <button className={classes.mapButton} onClick={() => navigate('/map')}>
          <MapIcon fontSize="small" />
          Mapa Geral
        </button>
      </div>

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
                Veículos
                <Chip
                  label={filteredDevices.length}
                  size="small"
                  sx={{ ml: 1, height: 22, fontSize: '0.7rem', fontWeight: 700, bgcolor: 'primary.main', color: '#fff' }}
                />
              </Typography>
            </Box>
            <Box className={classes.filterChips}>
              {['all', 'online', 'offline', 'moving', 'blocked'].map((key) => {
                const labels = { all: 'Todos', online: 'Online', offline: 'Offline', moving: 'Movendo', blocked: 'Bloqueados' };
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
              const speed = getSpeedKmh(device.id);
              const isMoving = speed > 1;
              const statusColor = statusColors[device.status] || '#94a3b8';

              return (
                <Paper key={device.id} className={classes.vehicleCard} elevation={0}>
                  <ListItemButton
                    onClick={() => navigate(`/settings/device/${device.id}`)}
                    sx={{ py: 1.5, px: 2, gap: 1.5 }}
                  >
                    <Avatar
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '14px',
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
                        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }} noWrap>
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
                      <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }} noWrap>
                        {position?.address || device.uniqueId}
                      </Typography>
                    </Box>

                    <Box className={classes.vehicleMeta}>
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

      <div className={classes.footer}>
        <BottomMenu />
      </div>
    </div>
  );
};

export default DashboardPage;
