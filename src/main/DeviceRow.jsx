import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
import {
  Tooltip,
  Avatar,
  Typography,
  Box,
  LinearProgress,
  Chip,
} from '@mui/material';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import Battery60Icon from '@mui/icons-material/Battery60';
import BatteryCharging60Icon from '@mui/icons-material/BatteryCharging60';
import Battery20Icon from '@mui/icons-material/Battery20';
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';
import SpeedIcon from '@mui/icons-material/Speed';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AnchorIcon from '@mui/icons-material/Anchor';
import PowerIcon from '@mui/icons-material/Power';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import NavigationIcon from '@mui/icons-material/Navigation';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import NightlightIcon from '@mui/icons-material/Nightlight';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { devicesActions } from '../store';
import {
  formatAlarm,
  formatBoolean,
} from '../common/util/formatter';
import { useTranslation } from '../common/components/LocalizationProvider';
import { mapIconKey, mapIcons } from '../map/core/preloadImages';
import { useAdministrator } from '../common/util/permissions';
import EngineIcon from '../resources/images/data/engine.svg?react';

dayjs.extend(relativeTime);

const statusColors = {
  online: '#10b981',
  offline: '#ef4444',
  unknown: '#94a3b8',
};

const useStyles = makeStyles()((theme) => ({
  card: {
    borderRadius: 14,
    margin: '4px 6px',
    padding: '10px 12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    },
  },
  cardSelected: {
    borderColor: theme.palette.primary.main,
    backgroundColor: `${theme.palette.primary.main}08`,
    boxShadow: `0 0 0 1px ${theme.palette.primary.main}40`,
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  vehicleIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    flexShrink: 0,
  },
  iconImg: {
    width: 20,
    height: 20,
    filter: 'brightness(0) invert(1)',
  },
  nameSection: {
    flex: 1,
    minWidth: 0,
  },
  vehicleName: {
    fontWeight: 700,
    fontSize: '0.85rem',
    lineHeight: 1.2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  imeiRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    marginTop: 1,
  },
  imeiText: {
    fontSize: '0.65rem',
    color: theme.palette.text.secondary,
    fontFamily: 'monospace',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '2px 8px',
    borderRadius: 20,
    fontSize: '0.65rem',
    fontWeight: 600,
    flexShrink: 0,
  },
  featureChips: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  chip: {
    height: 20,
    fontSize: '0.6rem',
    fontWeight: 600,
    borderRadius: 6,
    '& .MuiChip-icon': {
      fontSize: '0.75rem',
      marginLeft: 4,
    },
    '& .MuiChip-label': {
      padding: '0 5px',
    },
  },
  addressRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 3,
  },
  addressText: {
    fontSize: '0.67rem',
    color: theme.palette.text.secondary,
    lineHeight: 1.3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  infoGrid: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.2),
    flexWrap: 'wrap',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    fontSize: '0.67rem',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
  },
  infoIcon: {
    fontSize: '0.8rem !important',
    opacity: 0.6,
  },
  bottomRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  speedBar: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.8),
    flex: 1,
    marginRight: 8,
  },
  speedProgress: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  speedLabel: {
    fontSize: '0.7rem',
    fontWeight: 700,
    minWidth: 48,
    textAlign: 'right',
  },
  batteryInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
  },
  success: { color: theme.palette.success.main },
  warning: { color: theme.palette.warning.main },
  error: { color: theme.palette.error.main },
  neutral: { color: theme.palette.neutral.main },
}));

const DeviceRow = ({ devices, index, style }) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const t = useTranslation();

  const admin = useAdministrator();
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const item = devices[index];
  const position = useSelector((state) => state.session.positions[item.id]);

  const attrs = position?.attributes || {};
  const speedKmh = position ? Math.round((position.speed || 0) * 1.852) : 0;
  const satellites = attrs.sat;
  const batteryLevel = attrs.batteryLevel;
  const ignition = attrs.ignition;
  const blocked = attrs.blocked;
  const alarm = attrs.alarm;
  const motion = attrs.motion;
  const lastUpdate = position?.fixTime || item.lastUpdate;
  const deviceTime = position?.deviceTime;
  const serverTime = position?.serverTime;
  const address = position?.address;
  const geofenceIds = position?.geofenceIds;
  const isOnline = item.status === 'online';
  const isSelected = selectedDeviceId === item.id;
  const course = position?.course;
  const totalDistance = attrs.totalDistance;
  const fuel = attrs.fuel;
  const temp = attrs.deviceTemp;

  const getSpeedColor = (speed) => {
    if (speed === 0) return '#94a3b8';
    if (speed < 40) return '#10b981';
    if (speed < 80) return '#f59e0b';
    return '#ef4444';
  };

  const getBatteryIcon = () => {
    if (batteryLevel == null) return null;
    const charge = attrs.charge;
    const size = 15;
    if (batteryLevel > 70) {
      return charge
        ? <BatteryChargingFullIcon sx={{ fontSize: size }} className={classes.success} />
        : <BatteryFullIcon sx={{ fontSize: size }} className={classes.success} />;
    }
    if (batteryLevel > 30) {
      return charge
        ? <BatteryCharging60Icon sx={{ fontSize: size }} className={classes.warning} />
        : <Battery60Icon sx={{ fontSize: size }} className={classes.warning} />;
    }
    return charge
      ? <BatteryCharging20Icon sx={{ fontSize: size }} className={classes.error} />
      : <Battery20Icon sx={{ fontSize: size }} className={classes.error} />;
  };

  // Build feature chips
  const chips = [];

  // Ignition
  if (ignition !== undefined) {
    chips.push({
      key: 'ignition',
      label: ignition ? t('statusIgnitionOn') : t('statusIgnitionOff'),
      icon: ignition
        ? <PowerIcon sx={{ color: '#10b981' }} />
        : <PowerOffIcon sx={{ color: '#94a3b8' }} />,
      color: ignition ? '#10b981' : '#94a3b8',
    });
  }

  if (motion !== undefined) {
    chips.push({
      key: 'motion',
      label: motion ? t('statusMoving') : t('statusStopped'),
      icon: motion
        ? <DirectionsRunIcon sx={{ color: '#3b82f6' }} />
        : <NightlightIcon sx={{ color: '#94a3b8' }} />,
      color: motion ? '#3b82f6' : '#94a3b8',
    });
  }

  if (blocked !== undefined) {
    chips.push({
      key: 'blocked',
      label: blocked ? t('statusBlocked') : t('statusUnblocked'),
      icon: blocked
        ? <LockIcon sx={{ color: '#ef4444' }} />
        : <LockOpenIcon sx={{ color: '#10b981' }} />,
      color: blocked ? '#ef4444' : '#10b981',
    });
  }

  if (alarm) {
    chips.push({
      key: 'alarm',
      label: formatAlarm(alarm, t),
      icon: <NotificationsActiveIcon sx={{ color: '#ef4444' }} />,
      color: '#ef4444',
    });
  }

  if (geofenceIds?.length > 0) {
    chips.push({
      key: 'anchor',
      label: `${t('statusAnchorActive')} (${geofenceIds.length})`,
      icon: <AnchorIcon sx={{ color: '#8b5cf6' }} />,
      color: '#8b5cf6',
    });
  }

  if (item.disabled) {
    chips.push({
      key: 'disabled',
      label: t('statusDisabled'),
      icon: <WarningAmberIcon sx={{ color: '#f59e0b' }} />,
      color: '#f59e0b',
    });
  }

  return (
    <div style={style}>
      <div
        className={`${classes.card} ${isSelected ? classes.cardSelected : ''}`}
        onClick={() => dispatch(devicesActions.selectId(isSelected ? null : item.id))}
        role="button"
        tabIndex={0}
      >
        {/* Row 1: Avatar + Name + Status + compact speed */}
        <div className={classes.topRow}>
          <Avatar className={classes.vehicleIcon}>
            <img className={classes.iconImg} src={mapIcons[mapIconKey(item.category)]} alt="" />
          </Avatar>
          <div className={classes.nameSection}>
            <Typography className={classes.vehicleName}>{item.name}</Typography>
            <div className={classes.imeiRow}>
              <FingerprintIcon sx={{ fontSize: '0.68rem', opacity: 0.4, color: 'text.secondary' }} />
              <Typography className={classes.imeiText}>{item.uniqueId}</Typography>
            </div>
          </div>
          {/* Compact: show speed + time inline */}
          {!isSelected && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: getSpeedColor(speedKmh) }}>
                {speedKmh} km/h
              </Typography>
              {lastUpdate && (
                <Typography sx={{ fontSize: '0.62rem', color: 'text.secondary', opacity: 0.7 }}>
                  {dayjs(lastUpdate).fromNow()}
                </Typography>
              )}
            </Box>
          )}
          <span
            className={classes.statusBadge}
            style={{
              backgroundColor: `${statusColors[item.status] || statusColors.unknown}18`,
              color: statusColors[item.status] || statusColors.unknown,
            }}
          >
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: statusColors[item.status] || statusColors.unknown }} />
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Expanded content */}
        {isSelected && (
          <>
            {/* Feature chips */}
            {chips.length > 0 && (
              <div className={classes.featureChips}>
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
                    }}
                  />
                ))}
              </div>
            )}

            {/* Address */}
            {address && (
              <div className={classes.addressRow}>
                <LocationOnIcon sx={{ fontSize: '0.78rem', color: 'text.secondary', opacity: 0.5, mt: '1px', flexShrink: 0 }} />
                <Typography className={classes.addressText}>{address}</Typography>
              </div>
            )}

            {/* Info grid */}
            <div className={classes.infoGrid}>
              {satellites != null && (
                <span className={classes.infoItem}>
                  <SignalCellularAltIcon className={classes.infoIcon} />
                  {satellites} sat
                </span>
              )}
              {course != null && (
                <Tooltip title={`Direção: ${Math.round(course)}°`}>
                  <span className={classes.infoItem}>
                    <NavigationIcon className={classes.infoIcon} sx={{ transform: `rotate(${course}deg)` }} />
                    {Math.round(course)}°
                  </span>
                </Tooltip>
              )}
              {totalDistance != null && (
                <span className={classes.infoItem}>
                  🛣️ {Math.round(totalDistance / 1000).toLocaleString()} km
                </span>
              )}
              {fuel != null && (
                <span className={classes.infoItem}>
                  <LocalGasStationIcon className={classes.infoIcon} />
                  {Math.round(fuel)}%
                </span>
              )}
              {temp != null && (
                <span className={classes.infoItem}>
                  <ThermostatIcon className={classes.infoIcon} />
                  {temp.toFixed(1)}°C
                </span>
              )}
              {lastUpdate && (
                <Tooltip title="Hora GPS">
                  <span className={classes.infoItem}>
                    <AccessTimeIcon className={classes.infoIcon} />
                    GPS {dayjs(lastUpdate).format('HH:mm:ss')}
                  </span>
                </Tooltip>
              )}
              {deviceTime && (
                <Tooltip title="Hora GSM (dispositivo)">
                  <span className={classes.infoItem}>
                    📶 GSM {dayjs(deviceTime).format('HH:mm:ss')}
                  </span>
                </Tooltip>
              )}
              {serverTime && (
                <Tooltip title="Hora GPRS (servidor)">
                  <span className={classes.infoItem}>
                    🌐 GPRS {dayjs(serverTime).format('HH:mm:ss')}
                  </span>
                </Tooltip>
              )}
              {lastUpdate && (
                <span className={classes.infoItem} style={{ opacity: 0.6 }}>
                  {dayjs(lastUpdate).fromNow()}
                </span>
              )}
            </div>

            {/* Speed bar + Battery */}
            <div className={classes.bottomRow}>
              <div className={classes.speedBar}>
                <SpeedIcon sx={{ fontSize: 14, color: getSpeedColor(speedKmh), opacity: 0.8 }} />
                <LinearProgress
                  variant="determinate"
                  value={Math.min(speedKmh, 120) / 1.2}
                  className={classes.speedProgress}
                  sx={{
                    backgroundColor: 'action.hover',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getSpeedColor(speedKmh),
                      borderRadius: 2,
                    },
                  }}
                />
                <Typography className={classes.speedLabel} sx={{ color: getSpeedColor(speedKmh) }}>
                  {speedKmh} km/h
                </Typography>
              </div>
              {batteryLevel != null && (
                <div className={classes.batteryInfo}>
                  {getBatteryIcon()}
                  <Typography sx={{ fontSize: '0.67rem', fontWeight: 600, color: 'text.secondary' }}>
                    {Math.round(batteryLevel)}%
                  </Typography>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeviceRow;
