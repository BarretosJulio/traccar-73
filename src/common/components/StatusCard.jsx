import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Rnd } from 'react-rnd';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Menu,
  MenuItem,
  CardMedia,
  Link,
  Tooltip,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTheme, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RouteIcon from '@mui/icons-material/Route';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PendingIcon from '@mui/icons-material/Pending';
import SpeedIcon from '@mui/icons-material/Speed';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import NavigationIcon from '@mui/icons-material/Navigation';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import Battery60Icon from '@mui/icons-material/Battery60';
import Battery20Icon from '@mui/icons-material/Battery20';
import PowerIcon from '@mui/icons-material/Power';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import NightlightIcon from '@mui/icons-material/Nightlight';
import AnchorIcon from '@mui/icons-material/Anchor';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import HeightIcon from '@mui/icons-material/Height';
import dayjs from 'dayjs';

import { useTranslation } from './LocalizationProvider';
import RemoveDialog from './RemoveDialog';
import { useDeviceReadonly, useRestriction } from '../util/permissions';
import { devicesActions } from '../../store';
import { useCatch, useCatchCallback } from '../../reactHelper';
import { useAttributePreference } from '../util/preferences';
import { formatAlarm, formatBoolean } from '../util/formatter';
import { mapIconKey, mapIcons } from '../../map/core/preloadImages';
import fetchOrThrow from '../util/fetchOrThrow';

const useStyles = makeStyles()((theme, { desktopPadding }) => ({
  card: {
    pointerEvents: 'auto',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
      width: 360,
      borderRadius: 16,
      boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)',
    },
    [theme.breakpoints.up('md')]: {
      width: '100%',
      borderRadius: 12,
      boxShadow: '0 -4px 24px rgba(0,0,0,0.2), 0 2px 12px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
    },
  },
  media: {
    height: theme.dimensions.popupImageHeight,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  mediaButton: {
    color: theme.palette.common.white,
    mixBlendMode: 'difference',
  },
  vehicleImageSection: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(1, 1.5),
      borderRight: `1px solid ${theme.palette.divider}`,
      flexShrink: 0,
    },
  },
  vehicleImageAvatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleImageImg: {
    width: 28,
    height: 28,
    filter: 'brightness(0) invert(1)',
  },
  desktopBody: {
    [theme.breakpoints.up('md')]: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
    },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.8),
    padding: theme.spacing(0.5, 1.5, 0, 1.5),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(0.5, 1.5, 0, 1),
    },
  },
  headerIcon: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  headerIconImg: {
    width: 14,
    height: 14,
    filter: 'brightness(0) invert(1)',
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  content: {
    padding: theme.spacing(0.3, 1.5, 0.3, 1.5),
    overflow: 'auto',
    [theme.breakpoints.down('md')]: {
      maxHeight: 350,
    },
    [theme.breakpoints.up('md')]: {
      maxHeight: 'none',
      padding: theme.spacing(0.3, 1.5, 0.3, 1),
      flex: 1,
    },
  },
  chipsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 3,
    marginBottom: 3,
  },
  chip: {
    height: 18,
    fontSize: '0.58rem',
    fontWeight: 600,
    borderRadius: 5,
    '& .MuiChip-icon': { fontSize: '0.68rem', marginLeft: 3 },
    '& .MuiChip-label': { padding: '0 4px' },
  },
  dataGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2px 10px',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '1px 14px',
    },
  },
  dataItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
  },
  dataIcon: {
    fontSize: '0.78rem !important',
    opacity: 0.5,
    color: theme.palette.text.secondary,
  },
  dataLabel: {
    fontSize: '0.55rem',
    color: theme.palette.text.secondary,
    lineHeight: 1,
  },
  dataValue: {
    fontSize: '0.68rem',
    fontWeight: 600,
    lineHeight: 1.1,
  },
  fullWidthItem: {
    gridColumn: '1 / -1',
  },
  actions: {
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1),
    minHeight: 32,
    borderTop: `1px solid ${theme.palette.divider}`,
    '& .MuiIconButton-root': {
      padding: 5,
    },
  },
  root: {
    pointerEvents: 'none',
    position: 'fixed',
    zIndex: 5,
    [theme.breakpoints.up('md')]: {
      left: `calc(${desktopPadding || '0px'} + 8px)`,
      right: 52,
      bottom: 8,
    },
    [theme.breakpoints.down('md')]: {
      left: '50%',
      bottom: `calc(${theme.spacing(3)} + ${theme.dimensions.bottomBarHeight}px)`,
      transform: 'translateX(-50%)',
    },
  },
}));

const DataItem = ({ icon, label, value, fullWidth, color }) => {
  const { classes } = useStyles({ desktopPadding: 0 });
  return (
    <div className={`${classes.dataItem} ${fullWidth ? classes.fullWidthItem : ''}`}>
      {icon}
      <div>
        <Typography className={classes.dataLabel}>{label}</Typography>
        <Typography className={classes.dataValue} sx={color ? { color } : {}}>
          {value}
        </Typography>
      </div>
    </div>
  );
};

const StatusCard = ({ deviceId, position, onClose, disableActions, desktopPadding = 0 }) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const { classes } = useStyles({ desktopPadding });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();

  const readonly = useRestriction('readonly');
  const deviceReadonly = useDeviceReadonly();

  const shareDisabled = useSelector((state) => state.session.server.attributes.disableShare);
  const user = useSelector((state) => state.session.user);
  const device = useSelector((state) => state.devices.items[deviceId]);

  const deviceImage = device?.attributes?.deviceImage;

  const navigationAppLink = useAttributePreference('navigationAppLink');
  const navigationAppTitle = useAttributePreference('navigationAppTitle');

  const [anchorEl, setAnchorEl] = useState(null);
  const [removing, setRemoving] = useState(false);

  const attrs = position?.attributes || {};
  const speedKmh = position ? Math.round((position.speed || 0) * 1.852) : 0;

  const handleRemove = useCatch(async (removed) => {
    if (removed) {
      const response = await fetchOrThrow('/api/devices');
      dispatch(devicesActions.refresh(await response.json()));
    }
    setRemoving(false);
  });

  const handleGeofence = useCatchCallback(async () => {
    const newItem = {
      name: t('sharedGeofence'),
      area: `CIRCLE (${position.latitude} ${position.longitude}, 50)`,
    };
    const response = await fetchOrThrow('/api/geofences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
    const item = await response.json();
    await fetchOrThrow('/api/permissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId: position.deviceId, geofenceId: item.id }),
    });
    navigate(`/settings/geofence/${item.id}`);
  }, [navigate, position]);

  // Build chips
  const chips = [];
  if (attrs.ignition !== undefined) {
    chips.push({
      key: 'ign', label: attrs.ignition ? 'Ligado' : 'Desligado',
      icon: attrs.ignition ? <PowerIcon /> : <PowerOffIcon />,
      color: attrs.ignition ? '#10b981' : '#94a3b8',
    });
  }
  if (attrs.motion !== undefined) {
    chips.push({
      key: 'motion', label: attrs.motion ? 'Movendo' : 'Parado',
      icon: attrs.motion ? <DirectionsRunIcon /> : <NightlightIcon />,
      color: attrs.motion ? '#3b82f6' : '#94a3b8',
    });
  }
  if (attrs.blocked !== undefined) {
    chips.push({
      key: 'blocked', label: attrs.blocked ? 'Bloqueado' : 'Desbloq.',
      icon: attrs.blocked ? <LockIcon /> : <LockOpenIcon />,
      color: attrs.blocked ? '#ef4444' : '#10b981',
    });
  }
  if (position?.geofenceIds?.length > 0) {
    chips.push({
      key: 'anchor', label: 'Âncora Ativa',
      icon: <AnchorIcon />, color: '#8b5cf6',
    });
  }
  if (attrs.alarm) {
    chips.push({
      key: 'alarm', label: formatAlarm(attrs.alarm, t),
      icon: <NotificationsActiveIcon />, color: '#ef4444',
    });
  }

  const getSpeedColor = (s) => {
    if (s === 0) return '#94a3b8';
    if (s < 40) return '#10b981';
    if (s < 80) return '#f59e0b';
    return '#ef4444';
  };

  const getBatteryColor = (level) => {
    if (level > 70) return '#10b981';
    if (level > 30) return '#f59e0b';
    return '#ef4444';
  };

  const getBatteryIcon = (level) => {
    const sx = { fontSize: '0.9rem', color: getBatteryColor(level) };
    if (level > 70) return <BatteryFullIcon sx={sx} />;
    if (level > 30) return <Battery60Icon sx={sx} />;
    return <Battery20Icon sx={sx} />;
  };

  return (
    <>
      <div className={classes.root}>
        {device && (
          <Rnd
            default={{ x: 0, y: 0, width: 'auto', height: 'auto' }}
            enableResizing={false}
            disableDragging={desktop}
            dragHandleClassName="draggable-header"
            style={{ position: 'relative', width: desktop ? '100%' : 'auto' }}
          >
            <Card elevation={3} className={classes.card}>
              {/* Vehicle image on desktop */}
              <div className={classes.vehicleImageSection}>
                <div className={classes.vehicleImageAvatar}>
                  <img
                    className={classes.vehicleImageImg}
                    src={mapIcons[mapIconKey(device.category)]}
                    alt=""
                  />
                </div>
              </div>

              <div className={classes.desktopBody}>
              {deviceImage ? (
                <CardMedia
                  className={`${classes.media} draggable-header`}
                  image={`/api/media/${device.uniqueId}/${deviceImage}`}
                >
                  <IconButton size="small" onClick={onClose} onTouchStart={onClose}>
                    <CloseIcon fontSize="small" className={classes.mediaButton} />
                  </IconButton>
                </CardMedia>
              ) : (
                <div className={`${classes.header} draggable-header`}>
                  <div className={classes.headerIcon}>
                    <img
                      className={classes.headerIconImg}
                      src={mapIcons[mapIconKey(device.category)]}
                      alt=""
                    />
                  </div>
                  <div className={classes.headerInfo}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.2 }}>
                      {device.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary', fontFamily: 'monospace' }}>
                      ID: {device.uniqueId}
                      {device.phone && ` • ${device.phone}`}
                    </Typography>
                  </div>
                  <Chip
                    size="small"
                    label={device.status === 'online' ? 'Online' : 'Offline'}
                    sx={{
                      height: 20,
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      backgroundColor: `${device.status === 'online' ? '#10b981' : '#ef4444'}18`,
                      color: device.status === 'online' ? '#10b981' : '#ef4444',
                      border: `1px solid ${device.status === 'online' ? '#10b981' : '#ef4444'}30`,
                    }}
                  />
                  <IconButton size="small" onClick={onClose} onTouchStart={onClose} sx={{ padding: '4px' }}>
                    <CloseIcon sx={{ fontSize: '1rem' }} />
                  </IconButton>
                </div>
              )}

              {position && (
                <CardContent className={classes.content}>
                  {/* Feature chips */}
                  {chips.length > 0 && (
                    <div className={classes.chipsRow}>
                      {chips.map((c) => (
                        <Chip
                          key={c.key}
                          label={c.label}
                          icon={c.icon}
                          size="small"
                          className={classes.chip}
                          sx={{
                            backgroundColor: `${c.color}14`,
                            color: c.color,
                            border: `1px solid ${c.color}30`,
                            '& .MuiChip-icon': { color: c.color },
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Address */}
                  {position.address && (
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 1, alignItems: 'flex-start' }}>
                      <LocationOnIcon sx={{ fontSize: '0.9rem', color: 'primary.main', mt: '2px', opacity: 0.7 }} />
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.4 }}>
                        {position.address}
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 0.4 }} />

                  {/* Data grid */}
                  <div className={classes.dataGrid}>
                    {/* Speed */}
                    <DataItem
                      icon={<SpeedIcon className={classes.dataIcon} />}
                      label="Velocidade"
                      value={`${speedKmh} km/h`}
                      color={getSpeedColor(speedKmh)}
                    />

                    {/* Course */}
                    {position.course != null && (
                      <DataItem
                        icon={<NavigationIcon className={classes.dataIcon} sx={{ transform: `rotate(${position.course}deg)` }} />}
                        label="Direção"
                        value={`${Math.round(position.course)}°`}
                      />
                    )}

                    {/* Battery */}
                    {attrs.batteryLevel != null && (
                      <DataItem
                        icon={getBatteryIcon(attrs.batteryLevel)}
                        label="Bateria"
                        value={`${Math.round(attrs.batteryLevel)}%`}
                        color={getBatteryColor(attrs.batteryLevel)}
                      />
                    )}

                    {/* Satellites */}
                    {attrs.sat != null && (
                      <DataItem
                        icon={<SignalCellularAltIcon className={classes.dataIcon} />}
                        label="Satélites"
                        value={attrs.sat}
                      />
                    )}

                    {/* Altitude */}
                    {position.altitude != null && (
                      <DataItem
                        icon={<HeightIcon className={classes.dataIcon} />}
                        label="Altitude"
                        value={`${Math.round(position.altitude)} m`}
                      />
                    )}

                    {/* GPS Accuracy */}
                    {position.accuracy != null && (
                      <DataItem
                        icon={<GpsFixedIcon className={classes.dataIcon} />}
                        label="Precisão GPS"
                        value={`${Math.round(position.accuracy)} m`}
                      />
                    )}

                    {/* Total distance */}
                    {attrs.totalDistance != null && (
                      <DataItem
                        icon={<Box component="span" sx={{ fontSize: '0.85rem', opacity: 0.5 }}>🛣️</Box>}
                        label="Km Total"
                        value={`${(attrs.totalDistance / 1000).toFixed(1)} km`}
                      />
                    )}

                    {/* Hours */}
                    {attrs.hours != null && (
                      <DataItem
                        icon={<AccessTimeIcon className={classes.dataIcon} />}
                        label="Horas Motor"
                        value={`${Math.round(attrs.hours / 3600000)} h`}
                      />
                    )}

                    {/* Coordinates */}
                    <DataItem
                      icon={<Box component="span" sx={{ fontSize: '0.85rem', opacity: 0.5 }}>📍</Box>}
                      label="Lat / Lng"
                      value={`${position.latitude.toFixed(5)}, ${position.longitude.toFixed(5)}`}
                      fullWidth
                    />

                    {/* Protocol */}
                    {position.protocol && (
                      <DataItem
                        icon={<Box component="span" sx={{ fontSize: '0.85rem', opacity: 0.5 }}>📡</Box>}
                        label="Protocolo"
                        value={position.protocol}
                      />
                    )}

                    {/* RPM */}
                    {attrs.rpm != null && (
                      <DataItem
                        icon={<Box component="span" sx={{ fontSize: '0.85rem', opacity: 0.5 }}>⚙️</Box>}
                        label="RPM"
                        value={attrs.rpm}
                      />
                    )}

                    {/* Power voltage */}
                    {attrs.power != null && (
                      <DataItem
                        icon={<PowerIcon className={classes.dataIcon} />}
                        label="Tensão"
                        value={`${attrs.power.toFixed(1)} V`}
                      />
                    )}
                  </div>

                  <Divider sx={{ my: 0.5 }} />

                  {/* Timestamps */}
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 0.3, md: 2 }, flexWrap: 'wrap' }}>
                    {position.fixTime && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>Hora GPS</Typography>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 600 }}>
                          {dayjs(position.fixTime).format('DD/MM/YYYY, HH:mm:ss')}
                        </Typography>
                      </Box>
                    )}
                    {position.deviceTime && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>Hora GSM</Typography>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 600 }}>
                          {dayjs(position.deviceTime).format('DD/MM/YYYY, HH:mm:ss')}
                        </Typography>
                      </Box>
                    )}
                    {position.serverTime && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>Hora GPRS</Typography>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 600 }}>
                          {dayjs(position.serverTime).format('DD/MM/YYYY, HH:mm:ss')}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>Atualização</Typography>
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 500, color: 'text.secondary' }}>
                        {dayjs(position.fixTime).fromNow()}
                      </Typography>
                    </Box>
                  </Box>

                  {/* More details link */}
                  <Box sx={{ mt: 0.3 }}>
                    <Typography sx={{ fontSize: '0.7rem' }}>
                      <Link component={RouterLink} to={`/position/${position.id}`}>
                        {t('sharedShowDetails')}
                      </Link>
                    </Typography>
                  </Box>
                </CardContent>
              )}

              <CardActions classes={{ root: classes.actions }} disableSpacing>
                <Tooltip title={t('sharedExtra')}>
                  <IconButton
                    color="secondary"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    disabled={!position}
                  >
                    <PendingIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('reportReplay')}>
                  <IconButton
                    onClick={() => navigate(`/replay?deviceId=${deviceId}`)}
                    disabled={disableActions || !position}
                  >
                    <RouteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('commandTitle')}>
                  <IconButton
                    onClick={() => navigate(`/settings/device/${deviceId}/command`)}
                    disabled={disableActions}
                  >
                    <SendIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('sharedEdit')}>
                  <IconButton
                    onClick={() => navigate(`/settings/device/${deviceId}`)}
                    disabled={disableActions || deviceReadonly}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('sharedRemove')}>
                  <IconButton
                    color="error"
                    onClick={() => setRemoving(true)}
                    disabled={disableActions || deviceReadonly}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
              </div>{/* end desktopBody */}
            </Card>
          </Rnd>
        )}
      </div>
      {position && (
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          {!readonly && <MenuItem onClick={handleGeofence}>{t('sharedCreateGeofence')}</MenuItem>}
          <MenuItem
            component="a"
            target="_blank"
            href={`https://www.google.com/maps/search/?api=1&query=${position.latitude}%2C${position.longitude}`}
          >
            {t('linkGoogleMaps')}
          </MenuItem>
          <MenuItem
            component="a"
            target="_blank"
            href={`http://maps.apple.com/?ll=${position.latitude},${position.longitude}`}
          >
            {t('linkAppleMaps')}
          </MenuItem>
          <MenuItem
            component="a"
            target="_blank"
            href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${position.latitude}%2C${position.longitude}&heading=${position.course}`}
          >
            {t('linkStreetView')}
          </MenuItem>
          {navigationAppTitle && (
            <MenuItem
              component="a"
              target="_blank"
              href={navigationAppLink
                .replace('{latitude}', position.latitude)
                .replace('{longitude}', position.longitude)}
            >
              {navigationAppTitle}
            </MenuItem>
          )}
          {!shareDisabled && !user.temporary && (
            <MenuItem onClick={() => navigate(`/settings/device/${deviceId}/share`)}>
              <Typography color="secondary">{t('deviceShare')}</Typography>
            </MenuItem>
          )}
        </Menu>
      )}
      <RemoveDialog
        open={removing}
        endpoint="devices"
        itemId={deviceId}
        onResult={(removed) => handleRemove(removed)}
      />
    </>
  );
};

export default StatusCard;
