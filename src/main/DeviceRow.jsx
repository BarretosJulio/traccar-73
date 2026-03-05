import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
import {
  IconButton,
  Tooltip,
  Avatar,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import Battery60Icon from '@mui/icons-material/Battery60';
import BatteryCharging60Icon from '@mui/icons-material/BatteryCharging60';
import Battery20Icon from '@mui/icons-material/Battery20';
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';
import ErrorIcon from '@mui/icons-material/Error';
import SpeedIcon from '@mui/icons-material/Speed';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { devicesActions } from '../store';
import {
  formatAlarm,
  formatBoolean,
  formatPercentage,
  formatStatus,
  getStatusColor,
} from '../common/util/formatter';
import { useTranslation } from '../common/components/LocalizationProvider';
import { mapIconKey, mapIcons } from '../map/core/preloadImages';
import { useAdministrator } from '../common/util/permissions';
import EngineIcon from '../resources/images/data/engine.svg?react';
import { useAttributePreference } from '../common/util/preferences';

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
    padding: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
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
    gap: theme.spacing(1.2),
    marginBottom: theme.spacing(1),
  },
  vehicleIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    flexShrink: 0,
  },
  iconImg: {
    width: 22,
    height: 22,
    filter: 'brightness(0) invert(1)',
  },
  nameSection: {
    flex: 1,
    minWidth: 0,
  },
  vehicleName: {
    fontWeight: 700,
    fontSize: '0.9rem',
    lineHeight: 1.2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  imeiRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  imeiText: {
    fontSize: '0.68rem',
    color: theme.palette.text.secondary,
    fontFamily: 'monospace',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '2px 8px',
    borderRadius: 20,
    fontSize: '0.68rem',
    fontWeight: 600,
    flexShrink: 0,
  },
  rightIcons: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    flexShrink: 0,
  },
  infoGrid: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    flexWrap: 'wrap',
    marginBottom: theme.spacing(0.8),
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    fontSize: '0.72rem',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
  },
  infoIcon: {
    fontSize: '0.9rem !important',
    opacity: 0.6,
  },
  addressRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 4,
    marginBottom: theme.spacing(0.8),
  },
  addressText: {
    fontSize: '0.7rem',
    color: theme.palette.text.secondary,
    lineHeight: 1.3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  speedBar: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  speedProgress: {
    flex: 1,
    height: 5,
    borderRadius: 3,
  },
  speedLabel: {
    fontSize: '0.72rem',
    fontWeight: 700,
    minWidth: 52,
    textAlign: 'right',
  },
  bottomRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing(0.5),
  },
  batteryInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
  },
  success: {
    color: theme.palette.success.main,
  },
  warning: {
    color: theme.palette.warning.main,
  },
  error: {
    color: theme.palette.error.main,
  },
  neutral: {
    color: theme.palette.neutral.main,
  },
}));

const DeviceRow = ({ devices, index, style }) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const t = useTranslation();

  const admin = useAdministrator();
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const item = devices[index];
  const position = useSelector((state) => state.session.positions[item.id]);

  const speedKmh = position ? Math.round((position.speed || 0) * 1.852) : 0;
  const satellites = position?.attributes?.sat;
  const batteryLevel = position?.attributes?.batteryLevel;
  const ignition = position?.attributes?.ignition;
  const lastUpdate = position?.fixTime || item.lastUpdate;
  const address = position?.address;
  const isOnline = item.status === 'online';
  const isSelected = selectedDeviceId === item.id;

  const getSpeedColor = (speed) => {
    if (speed === 0) return '#94a3b8';
    if (speed < 40) return '#10b981';
    if (speed < 80) return '#f59e0b';
    return '#ef4444';
  };

  const getBatteryIcon = () => {
    if (!batteryLevel && batteryLevel !== 0) return null;
    const charge = position?.attributes?.charge;
    if (batteryLevel > 70) {
      return charge
        ? <BatteryChargingFullIcon sx={{ fontSize: 16 }} className={classes.success} />
        : <BatteryFullIcon sx={{ fontSize: 16 }} className={classes.success} />;
    }
    if (batteryLevel > 30) {
      return charge
        ? <BatteryCharging60Icon sx={{ fontSize: 16 }} className={classes.warning} />
        : <Battery60Icon sx={{ fontSize: 16 }} className={classes.warning} />;
    }
    return charge
      ? <BatteryCharging20Icon sx={{ fontSize: 16 }} className={classes.error} />
      : <Battery20Icon sx={{ fontSize: 16 }} className={classes.error} />;
  };

  return (
    <div style={style}>
      <div
        className={`${classes.card} ${isSelected ? classes.cardSelected : ''}`}
        onClick={() => dispatch(devicesActions.selectId(item.id))}
        role="button"
        tabIndex={0}
      >
        {/* Top: Avatar + Name + Status + Icons */}
        <div className={classes.topRow}>
          <Avatar className={classes.vehicleIcon}>
            <img className={classes.iconImg} src={mapIcons[mapIconKey(item.category)]} alt="" />
          </Avatar>
          <div className={classes.nameSection}>
            <Typography className={classes.vehicleName}>
              {item.name}
            </Typography>
            <div className={classes.imeiRow}>
              <FingerprintIcon sx={{ fontSize: '0.72rem', opacity: 0.5, color: 'text.secondary' }} />
              <Typography className={classes.imeiText}>
                {item.uniqueId}
              </Typography>
              {item.phone && (
                <>
                  <Typography className={classes.imeiText} sx={{ mx: 0.3 }}>•</Typography>
                  <Typography className={classes.imeiText}>{item.phone}</Typography>
                </>
              )}
            </div>
          </div>
          <span
            className={classes.statusBadge}
            style={{
              backgroundColor: `${statusColors[item.status] || statusColors.unknown}18`,
              color: statusColors[item.status] || statusColors.unknown,
            }}
          >
            <Box
              sx={{
                width: 6, height: 6, borderRadius: '50%',
                backgroundColor: statusColors[item.status] || statusColors.unknown,
              }}
            />
            {isOnline ? 'Online' : 'Offline'}
          </span>
          <div className={classes.rightIcons}>
            {position?.attributes?.hasOwnProperty('alarm') && (
              <Tooltip title={`${t('eventAlarm')}: ${formatAlarm(position.attributes.alarm, t)}`}>
                <ErrorIcon sx={{ fontSize: 18 }} className={classes.error} />
              </Tooltip>
            )}
            {ignition !== undefined && (
              <Tooltip title={`${t('positionIgnition')}: ${formatBoolean(ignition, t)}`}>
                <Box sx={{ display: 'flex' }}>
                  <EngineIcon
                    width={16}
                    height={16}
                    className={ignition ? classes.success : classes.neutral}
                  />
                </Box>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Address */}
        {address && (
          <div className={classes.addressRow}>
            <LocationOnIcon sx={{ fontSize: '0.85rem', color: 'text.secondary', opacity: 0.6, mt: '1px' }} />
            <Typography className={classes.addressText}>
              {address}
            </Typography>
          </div>
        )}

        {/* Info: GPS, Satellites, Time */}
        <div className={classes.infoGrid}>
          {satellites != null && (
            <span className={classes.infoItem}>
              <SignalCellularAltIcon className={classes.infoIcon} />
              {satellites} sat
            </span>
          )}
          {lastUpdate && (
            <span className={classes.infoItem}>
              <AccessTimeIcon className={classes.infoIcon} />
              {dayjs(lastUpdate).format('DD/MM/YYYY, HH:mm:ss')}
            </span>
          )}
          {lastUpdate && (
            <span className={classes.infoItem} style={{ opacity: 0.7 }}>
              {dayjs(lastUpdate).fromNow()}
            </span>
          )}
        </div>

        {/* Speed bar + Battery */}
        <div className={classes.bottomRow}>
          <div className={classes.speedBar} style={{ flex: 1, marginRight: 12 }}>
            <SpeedIcon sx={{ fontSize: 16, color: getSpeedColor(speedKmh), opacity: 0.8 }} />
            <LinearProgress
              variant="determinate"
              value={Math.min(speedKmh, 120) / 1.2}
              className={classes.speedProgress}
              sx={{
                backgroundColor: 'action.hover',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getSpeedColor(speedKmh),
                  borderRadius: 3,
                },
              }}
            />
            <Typography
              className={classes.speedLabel}
              sx={{ color: getSpeedColor(speedKmh) }}
            >
              {speedKmh} km/h
            </Typography>
          </div>

          {batteryLevel != null && (
            <div className={classes.batteryInfo}>
              {getBatteryIcon()}
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: 'text.secondary' }}>
                {Math.round(batteryLevel)}%
              </Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceRow;
