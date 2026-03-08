import { Fragment, useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
import {
  List, ListItemButton, ListItemText, Typography, Box,
  Collapse, Chip, IconButton, Tooltip,
} from '@mui/material';
import FenceIcon from '@mui/icons-material/Fence';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DescriptionIcon from '@mui/icons-material/Description';
import SpeedIcon from '@mui/icons-material/Speed';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PaletteIcon from '@mui/icons-material/Palette';

import { geofencesActions, errorsActions } from '../store';
import CollectionActions from '../settings/components/CollectionActions';
import { useCatchCallback } from '../reactHelper';
import fetchOrThrow from '../common/util/fetchOrThrow';
import { useTranslation } from '../common/components/LocalizationProvider';
import GeofenceDevicesDialog from './GeofenceDevicesDialog';

const useStyles = makeStyles()((theme) => ({
  list: {
    flexGrow: 1,
    overflow: 'auto',
    padding: theme.spacing(0.5),
  },
  listItem: {
    borderRadius: 10,
    margin: theme.spacing(0.25, 0),
    padding: theme.spacing(0.75, 1.5),
    transition: 'all 0.15s ease',
    '&:hover': {
      backgroundColor: `${theme.palette.primary.main}10`,
    },
    '&.Mui-selected': {
      backgroundColor: `${theme.palette.primary.main}15`,
      '&:hover': {
        backgroundColor: `${theme.palette.primary.main}20`,
      },
    },
  },
  itemIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${theme.palette.primary.main}12`,
    color: theme.palette.primary.main,
    marginRight: theme.spacing(1.5),
    flexShrink: 0,
  },
  itemIconDisabled: {
    backgroundColor: `${theme.palette.action.disabled}15`,
    color: theme.palette.action.disabled,
  },
  itemName: {
    fontWeight: 500,
    fontSize: '0.875rem',
    color: theme.palette.text.primary,
  },
  itemNameDisabled: {
    color: theme.palette.text.disabled,
    textDecoration: 'line-through',
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 7,
    transition: 'all 0.15s ease',
  },
  pauseButton: {
    color: theme.palette.warning.main,
    '&:hover': {
      backgroundColor: `${theme.palette.warning.main}15`,
    },
  },
  playButton: {
    color: theme.palette.success.main,
    '&:hover': {
      backgroundColor: `${theme.palette.success.main}15`,
    },
  },
  expandButton: {
    color: theme.palette.text.secondary,
    '&:hover': {
      backgroundColor: `${theme.palette.action.hover}`,
    },
  },
  detailsPanel: {
    padding: theme.spacing(1, 1.5, 1.5, 6),
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    marginBottom: theme.spacing(0.5),
  },
  detailIcon: {
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
  },
  detailLabel: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    fontWeight: 500,
    minWidth: 70,
  },
  detailValue: {
    fontSize: '0.75rem',
    color: theme.palette.text.primary,
  },
  chipRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    gap: theme.spacing(1.5),
    padding: theme.spacing(6),
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${theme.palette.primary.main}10`,
    color: theme.palette.primary.main,
    opacity: 0.6,
  },
}));

const GeofencesList = ({ onGeofenceSelected }) => {
  const { classes, cx } = useStyles();
  const dispatch = useDispatch();
  const t = useTranslation();

  const [expandedId, setExpandedId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [deviceCounts, setDeviceCounts] = useState({});
  const [dialogGeofence, setDialogGeofence] = useState(null);

  const items = useSelector((state) => state.geofences.items);
  const geofenceList = Object.values(items);

  // Fetch device counts for all geofences on mount
  useEffect(() => {
    geofenceList.forEach(async (item) => {
      if (deviceCounts[item.id] === undefined) {
        try {
          const response = await fetchOrThrow(`/api/devices?geofenceId=${item.id}`);
          const devices = await response.json();
          setDeviceCounts((prev) => ({ ...prev, [item.id]: devices.length }));
        } catch {
          setDeviceCounts((prev) => ({ ...prev, [item.id]: 0 }));
        }
      }
    });
  }, [geofenceList.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const refreshGeofences = useCatchCallback(async () => {
    const response = await fetchOrThrow('/api/geofences');
    dispatch(geofencesActions.refresh(await response.json()));
  }, [dispatch]);

  const handleTogglePause = async (event, item) => {
    event.stopPropagation();
    setTogglingId(item.id);
    try {
      const isDisabled = item.attributes?.disabled;
      const updatedItem = {
        ...item,
        attributes: {
          ...item.attributes,
          disabled: !isDisabled,
        },
      };
      await fetchOrThrow(`/api/geofences/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      });
      dispatch(geofencesActions.update([updatedItem]));
    } catch (error) {
      dispatch(errorsActions.push(error.message));
    }
    setTogglingId(null);
  };

  const fetchDeviceCount = useCallback(async (geofenceId) => {
    if (deviceCounts[geofenceId] !== undefined) return;
    try {
      const response = await fetchOrThrow(`/api/devices?geofenceId=${geofenceId}`);
      const devices = await response.json();
      setDeviceCounts((prev) => ({ ...prev, [geofenceId]: devices.length }));
    } catch {
      setDeviceCounts((prev) => ({ ...prev, [geofenceId]: 0 }));
    }
  }, [deviceCounts]);

  const handleToggleExpand = (event, itemId) => {
    event.stopPropagation();
    setExpandedId((prev) => {
      const next = prev === itemId ? null : itemId;
      if (next) fetchDeviceCount(next);
      return next;
    });
  };

  const handleCardClick = (item) => {
    onGeofenceSelected(item.id);
    setExpandedId((prev) => {
      const next = prev === item.id ? null : item.id;
      if (next) fetchDeviceCount(next);
      return next;
    });
  };

  const handleOpenDevicesDialog = (event, item) => {
    event.stopPropagation();
    setDialogGeofence(item);
  };

  const handleCloseDevicesDialog = () => {
    if (dialogGeofence) {
      // Refresh count after dialog closes
      setDeviceCounts((prev) => {
        const copy = { ...prev };
        delete copy[dialogGeofence.id];
        return copy;
      });
      fetchDeviceCount(dialogGeofence.id);
    }
    setDialogGeofence(null);
  };

  if (geofenceList.length === 0) {
    return (
      <div className={classes.emptyState}>
        <Box className={classes.emptyIcon}>
          <FenceIcon sx={{ fontSize: '1.5rem' }} />
        </Box>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {t('sharedNoData') || 'Nenhuma cerca cadastrada'}
        </Typography>
        <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ opacity: 0.7 }}>
          Desenhe no mapa para criar
        </Typography>
      </div>
    );
  }

  return (
    <>
    <List className={classes.list} disablePadding>
      {geofenceList.map((item) => {
        const isDisabled = item.attributes?.disabled;
        const isExpanded = expandedId === item.id;
        const isToggling = togglingId === item.id;

        return (
          <Fragment key={item.id}>
            <ListItemButton
              className={classes.listItem}
              onClick={() => handleCardClick(item)}
            >
              <Box className={cx(classes.itemIcon, isDisabled && classes.itemIconDisabled)}>
                <FenceIcon sx={{ fontSize: '1rem' }} />
              </Box>
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  className: cx(classes.itemName, isDisabled && classes.itemNameDisabled),
                  noWrap: true,
                }}
              />
              <Tooltip title="Dispositivos vinculados">
                <Chip
                  size="small"
                  icon={<DirectionsCarIcon sx={{ fontSize: '0.8rem !important' }} />}
                  label={deviceCounts[item.id] ?? '—'}
                  variant="outlined"
                  color="primary"
                  onClick={(e) => handleOpenDevicesDialog(e, item)}
                  sx={{ fontSize: '0.7rem', height: 22, cursor: 'pointer', mr: 0.5 }}
                />
              </Tooltip>
              <Tooltip title={isDisabled ? 'Ativar cerca' : 'Pausar cerca'}>
                <IconButton
                  className={cx(classes.actionButton, isDisabled ? classes.playButton : classes.pauseButton)}
                  size="small"
                  onClick={(e) => handleTogglePause(e, item)}
                  disabled={isToggling}
                >
                  {isDisabled
                    ? <PlayCircleOutlineIcon sx={{ fontSize: '1.1rem' }} />
                    : <PauseCircleOutlineIcon sx={{ fontSize: '1.1rem' }} />}
                </IconButton>
              </Tooltip>
              <IconButton
                className={cx(classes.actionButton, classes.expandButton)}
                size="small"
                onClick={(e) => handleToggleExpand(e, item.id)}
              >
                {isExpanded
                  ? <ExpandLessIcon sx={{ fontSize: '1rem' }} />
                  : <ExpandMoreIcon sx={{ fontSize: '1rem' }} />}
              </IconButton>
              <CollectionActions
                itemId={item.id}
                editPath="/app/settings/geofence"
                endpoint="geofences"
                setTimestamp={refreshGeofences}
              />
            </ListItemButton>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box className={classes.detailsPanel}>
                {item.description && (
                  <div className={classes.detailRow}>
                    <DescriptionIcon className={classes.detailIcon} />
                    <Typography className={classes.detailLabel}>Descrição:</Typography>
                    <Typography className={classes.detailValue}>{item.description}</Typography>
                  </div>
                )}
                {item.calendarId && (
                  <div className={classes.detailRow}>
                    <ScheduleIcon className={classes.detailIcon} />
                    <Typography className={classes.detailLabel}>Agenda:</Typography>
                    <Typography className={classes.detailValue}>Calendário #{item.calendarId}</Typography>
                  </div>
                )}
                {item.attributes?.startTime && (
                  <div className={classes.detailRow}>
                    <AccessTimeIcon className={classes.detailIcon} />
                    <Typography className={classes.detailLabel}>Hora início:</Typography>
                    <Typography className={classes.detailValue}>{item.attributes.startTime}</Typography>
                  </div>
                )}
                {item.attributes?.endTime && (
                  <div className={classes.detailRow}>
                    <AccessTimeIcon className={classes.detailIcon} />
                    <Typography className={classes.detailLabel}>Hora fim:</Typography>
                    <Typography className={classes.detailValue}>{item.attributes.endTime}</Typography>
                  </div>
                )}
                {item.attributes?.activeDays && (
                  <div className={classes.detailRow}>
                    <CalendarTodayIcon className={classes.detailIcon} />
                    <Typography className={classes.detailLabel}>Dias ativos:</Typography>
                    <Typography className={classes.detailValue}>
                      {item.attributes.activeDays.split(',').map((d) => ({ MO: 'SEG', TU: 'TER', WE: 'QUA', TH: 'QUI', FR: 'SEX', SA: 'SÁB', SU: 'DOM' })[d] || d).join(' / ')}
                    </Typography>
                  </div>
                )}
                {(item.attributes?.startDate || item.attributes?.endDate) && (
                  <div className={classes.detailRow}>
                    <CalendarTodayIcon className={classes.detailIcon} />
                    <Typography className={classes.detailLabel}>Período:</Typography>
                    <Typography className={classes.detailValue}>
                      {item.attributes.startDate || '—'} até {item.attributes.endDate || '—'}
                    </Typography>
                  </div>
                )}
                {item.attributes?.speedLimit && (
                  <div className={classes.detailRow}>
                    <SpeedIcon className={classes.detailIcon} />
                    <Typography className={classes.detailLabel}>Vel. Limite:</Typography>
                    <Typography className={classes.detailValue}>
                      {(item.attributes.speedLimit * 1.852).toFixed(0)} km/h
                    </Typography>
                  </div>
                )}
                <div className={classes.chipRow}>
                  <Chip
                    size="small"
                    label={isDisabled ? 'Pausada' : 'Ativa'}
                    color={isDisabled ? 'default' : 'success'}
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: 22 }}
                  />
                  {item.attributes?.hide && (
                    <Chip
                      size="small"
                      icon={<VisibilityOffIcon sx={{ fontSize: '0.75rem !important' }} />}
                      label="Oculta no mapa"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 22 }}
                    />
                  )}
                  {item.attributes?.color && (
                    <Chip
                      size="small"
                      icon={<PaletteIcon sx={{ fontSize: '0.75rem !important' }} />}
                      label={item.attributes.color}
                      variant="outlined"
                      sx={{
                        fontSize: '0.7rem',
                        height: 22,
                        borderColor: item.attributes.color,
                        color: item.attributes.color,
                      }}
                    />
                  )}
                </div>
                {/* Show all other attributes as key-value pairs */}
                {Object.entries(item.attributes || {}).filter(
                  ([key]) => !['disabled', 'hide', 'color', 'speedLimit', 'startTime', 'endTime', 'activeDays', 'startDate', 'endDate'].includes(key),
                ).map(([key, value]) => (
                  <div className={classes.detailRow} key={key}>
                    <Typography className={classes.detailLabel}>{key}:</Typography>
                    <Typography className={classes.detailValue}>{String(value)}</Typography>
                  </div>
                ))}
                {!item.description && !item.calendarId && Object.keys(item.attributes || {}).filter(
                  (k) => k !== 'disabled',
                ).length === 0 && (
                  <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.6 }}>
                    Nenhuma configuração adicional
                  </Typography>
                )}
              </Box>
            </Collapse>
          </Fragment>
        );
      })}
    </List>
    <GeofenceDevicesDialog
      open={Boolean(dialogGeofence)}
      onClose={handleCloseDevicesDialog}
      geofenceId={dialogGeofence?.id}
      geofenceName={dialogGeofence?.name}
    />
    </>
  );

export default GeofencesList;
