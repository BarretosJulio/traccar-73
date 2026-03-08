import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Typography,
  IconButton,
  Tooltip,
  Box,
  Paper,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FenceIcon from '@mui/icons-material/Fence';
import { useNavigate } from 'react-router-dom';
import MapView from '../map/core/MapView';
import MapCurrentLocation from '../map/MapCurrentLocation';
import MapGeofenceEdit from '../map/draw/MapGeofenceEdit';
import GeofencesList from './GeofencesList';
import { useTranslation } from '../common/components/LocalizationProvider';
import MapGeocoder from '../map/geocoder/MapGeocoder';
import { errorsActions } from '../store';
import MapScale from '../map/MapScale';
import fetchOrThrow from '../common/util/fetchOrThrow';

const useStyles = makeStyles()((theme) => ({
  root: {
    height: '100%',
    position: 'relative',
  },
  mapContainer: {
    position: 'absolute',
    inset: 0,
  },
  floatingPanel: {
    position: 'absolute',
    left: theme.spacing(1.5),
    top: theme.spacing(1.5),
    bottom: theme.spacing(1.5),
    width: 340,
    zIndex: 3,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down('sm')]: {
      left: 0,
      right: 0,
      top: 'auto',
      bottom: 0,
      width: '100%',
      height: theme.dimensions.drawerHeightPhone,
      borderRadius: '16px 16px 0 0',
    },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1.5, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${theme.palette.primary.main}15`,
    color: theme.palette.primary.main,
  },
  title: {
    flexGrow: 1,
    fontWeight: 600,
    fontSize: '0.95rem',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    color: theme.palette.text.secondary,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: `${theme.palette.primary.main}15`,
      color: theme.palette.primary.main,
    },
  },
  fileInput: {
    display: 'none',
  },
}));

const GeofencesPage = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = useTranslation();

  const [selectedGeofenceId, setSelectedGeofenceId] = useState();

  const handleFile = (event) => {
    const files = Array.from(event.target.files);
    const [file] = files;
    const reader = new FileReader();
    reader.onload = async () => {
      const xml = new DOMParser().parseFromString(reader.result, 'text/xml');
      const segment = xml.getElementsByTagName('trkseg')[0];
      const coordinates = Array.from(segment.getElementsByTagName('trkpt'))
        .map((point) => `${point.getAttribute('lat')} ${point.getAttribute('lon')}`)
        .join(', ');
      const area = `LINESTRING (${coordinates})`;
      const newItem = { name: t('sharedGeofence'), area };
      try {
        const response = await fetchOrThrow('/api/geofences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        });
        const item = await response.json();
        navigate(`/app/settings/geofence/${item.id}`);
      } catch (error) {
        dispatch(errorsActions.push(error.message));
      }
    };
    reader.onerror = (event) => {
      dispatch(errorsActions.push(event.target.error));
    };
    reader.readAsText(file);
  };

  return (
    <div className={classes.root}>
      <div className={classes.mapContainer}>
        <MapView>
          <MapGeofenceEdit selectedGeofenceId={selectedGeofenceId} />
        </MapView>
        <MapScale />
        <MapCurrentLocation />
        <MapGeocoder />
      </div>
      <Paper className={classes.floatingPanel} elevation={0}>
        <div className={classes.header}>
          <Tooltip title={t('sharedBack')}>
            <IconButton className={classes.actionButton} size="small" onClick={() => navigate(-1)}>
              <ArrowBackIcon sx={{ fontSize: '1.1rem' }} />
            </IconButton>
          </Tooltip>
          <Box className={classes.headerIcon}>
            <FenceIcon sx={{ fontSize: '1rem' }} />
          </Box>
          <Typography className={classes.title}>
            {t('sharedGeofences')}
          </Typography>
          <label htmlFor="upload-gpx">
            <input
              accept=".gpx"
              id="upload-gpx"
              type="file"
              className={classes.fileInput}
              onChange={handleFile}
            />
            <Tooltip title={t('sharedUpload')}>
              <IconButton className={classes.actionButton} size="small" component="span">
                <UploadFileIcon sx={{ fontSize: '1.1rem' }} />
              </IconButton>
            </Tooltip>
          </label>
        </div>
        <GeofencesList onGeofenceSelected={setSelectedGeofenceId} />
      </Paper>
    </div>
  );
};

export default GeofencesPage;
