import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
import {
  IconButton,
  Tooltip,
  Avatar,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Typography,
  Box,
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
import GeofencesValue from '../common/components/GeofencesValue';
import DriverValue from '../common/components/DriverValue';
import MotionBar from './components/MotionBar';
import AddressValue from '../common/components/AddressValue';

dayjs.extend(relativeTime);

const useStyles = makeStyles()((theme) => ({
  icon: {
    width: '22px',
    height: '22px',
    filter: 'brightness(0) invert(1)',
  },
  batteryText: {
    fontSize: '0.75rem',
    fontWeight: 'normal',
    lineHeight: '0.875rem',
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
  row: {
    borderRadius: 14,
    margin: '2px 6px',
    padding: '10px 12px',
    transition: 'all 0.15s ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  selected: {
    backgroundColor: `${theme.palette.primary.main}12 !important`,
    borderLeft: `3px solid ${theme.palette.primary.main}`,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: theme.spacing(0.5),
  },
  detailsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(0.5),
    flexWrap: 'wrap',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    fontSize: '0.7rem',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
  },
  detailIcon: {
    fontSize: '0.85rem !important',
    opacity: 0.7,
  },
  addressRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
    fontSize: '0.7rem',
    color: theme.palette.text.secondary,
  },
  iconsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
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

  const devicePrimary = useAttributePreference('devicePrimary', 'name');
  const deviceSecondary = useAttributePreference('deviceSecondary', '');

  const resolveFieldValue = (field) => {
    if (field === 'geofenceIds') {
      const geofenceIds = position?.geofenceIds;
      return geofenceIds?.length ? <GeofencesValue geofenceIds={geofenceIds} /> : null;
    }
    if (field === 'driverUniqueId') {
      const driverUniqueId = position?.attributes?.driverUniqueId;
      return driverUniqueId ? <DriverValue driverUniqueId={driverUniqueId} /> : null;
    }
    if (field === 'motion') {
      return <MotionBar deviceId={item.id} />;
    }
    return item[field];
  };

  const primaryValue = resolveFieldValue(devicePrimary);
  const secondaryValue = resolveFieldValue(deviceSecondary);

  const statusColor = {
    online: '#10b981',
    offline: '#ef4444',
    unknown: '#94a3b8',
  };

  const speedKmh = position ? Math.round((position.speed || 0) * 1.852) : null;
  const satellites = position?.attributes?.sat;
  const lastUpdate = position?.fixTime || item.lastUpdate;
  const hasAddress = position?.address;

  const secondaryText = () => {
    let status;
    if (item.status === 'online' || !item.lastUpdate) {
      status = formatStatus(item.status, t);
    } else {
      status = dayjs(item.lastUpdate).fromNow();
    }
    return (
      <Box component="div">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {secondaryValue && (
            <>
              {secondaryValue}
              {' • '}
            </>
          )}
          <Box
            className={classes.statusDot}
            sx={{ backgroundColor: statusColor[item.status] || statusColor.unknown }}
          />
          <span className={classes[getStatusColor(item.status)]}>{status}</span>
        </Box>
        {/* Extra details row */}
        <Box className={classes.detailsRow}>
          {speedKmh !== null && (
            <Box className={classes.detailItem}>
              <SpeedIcon className={classes.detailIcon} />
              <span>{speedKmh} km/h</span>
            </Box>
          )}
          {satellites != null && (
            <Box className={classes.detailItem}>
              <GpsFixedIcon className={classes.detailIcon} />
              <span>{satellites} sat</span>
            </Box>
          )}
          {lastUpdate && (
            <Box className={classes.detailItem}>
              <AccessTimeIcon className={classes.detailIcon} />
              <span>{dayjs(lastUpdate).fromNow()}</span>
            </Box>
          )}
        </Box>
        {/* Address row */}
        {hasAddress && (
          <Box className={classes.addressRow}>
            <LocationOnIcon className={classes.detailIcon} sx={{ fontSize: '0.8rem !important' }} />
            <Typography noWrap sx={{ fontSize: '0.68rem', color: 'text.secondary', maxWidth: 220 }}>
              {position.address}
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <div style={style}>
      <ListItemButton
        key={item.id}
        onClick={() => dispatch(devicesActions.selectId(item.id))}
        disabled={!admin && item.disabled}
        selected={selectedDeviceId === item.id}
        className={`${classes.row} ${selectedDeviceId === item.id ? classes.selected : ''}`}
      >
        <ListItemAvatar>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
            }}
          >
            <img className={classes.icon} src={mapIcons[mapIconKey(item.category)]} alt="" />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={primaryValue}
          secondary={secondaryText()}
          slots={{
            primary: Typography,
            secondary: 'div',
          }}
          slotProps={{
            primary: { noWrap: true, sx: { fontWeight: 600, fontSize: '0.875rem' } },
            secondary: { sx: { fontSize: '0.75rem' } },
          }}
        />
        <Box className={classes.iconsContainer}>
          <Box sx={{ display: 'flex', gap: 0 }}>
            {position && (
              <>
                {position.attributes.hasOwnProperty('alarm') && (
                  <Tooltip title={`${t('eventAlarm')}: ${formatAlarm(position.attributes.alarm, t)}`}>
                    <IconButton size="small">
                      <ErrorIcon fontSize="small" className={classes.error} />
                    </IconButton>
                  </Tooltip>
                )}
                {position.attributes.hasOwnProperty('ignition') && (
                  <Tooltip
                    title={`${t('positionIgnition')}: ${formatBoolean(position.attributes.ignition, t)}`}
                  >
                    <IconButton size="small">
                      {position.attributes.ignition ? (
                        <EngineIcon width={18} height={18} className={classes.success} />
                      ) : (
                        <EngineIcon width={18} height={18} className={classes.neutral} />
                      )}
                    </IconButton>
                  </Tooltip>
                )}
                {position.attributes.hasOwnProperty('batteryLevel') && (
                  <Tooltip
                    title={`${t('positionBatteryLevel')}: ${formatPercentage(position.attributes.batteryLevel)}`}
                  >
                    <IconButton size="small">
                      {(position.attributes.batteryLevel > 70 &&
                        (position.attributes.charge ? (
                          <BatteryChargingFullIcon fontSize="small" className={classes.success} />
                        ) : (
                          <BatteryFullIcon fontSize="small" className={classes.success} />
                        ))) ||
                        (position.attributes.batteryLevel > 30 &&
                          (position.attributes.charge ? (
                            <BatteryCharging60Icon fontSize="small" className={classes.warning} />
                          ) : (
                            <Battery60Icon fontSize="small" className={classes.warning} />
                          ))) ||
                        (position.attributes.charge ? (
                          <BatteryCharging20Icon fontSize="small" className={classes.error} />
                        ) : (
                          <Battery20Icon fontSize="small" className={classes.error} />
                        ))}
                    </IconButton>
                  </Tooltip>
                )}
              </>
            )}
          </Box>
          {position?.attributes?.batteryLevel != null && (
            <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary', lineHeight: 1 }}>
              {Math.round(position.attributes.batteryLevel)}%
            </Typography>
          )}
        </Box>
      </ListItemButton>
    </div>
  );
};

export default DeviceRow;
