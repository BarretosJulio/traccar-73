import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Typography,
  IconButton,
  Tooltip,
  Box,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
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
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flexGrow: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
    },
  },
  drawer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(17, 24, 39, 0.92)'
      : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRight: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.up('sm')]: {
      width: theme.dimensions.drawerWidthDesktop,
    },
    [theme.breakpoints.down('sm')]: {
      height: theme.dimensions.drawerHeightPhone,
      borderRight: 'none',
      borderTop: `1px solid ${theme.palette.divider}`,
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
    width: 36,
    height: 36,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${theme.palette.primary.main}15`,
    color: theme.palette.primary.main,
  },
  title: {
    flexGrow: 1,
    fontWeight: 600,
    fontSize: '1rem',
    letterSpacing: '-0.01em',
  },
  backButton: {
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
  uploadButton: {
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
  mapContainer: {
    flexGrow: 1,
  },
  fileInput: {
    display: 'none',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    gap: theme.spacing(1),
    padding: theme.spacing(4),
    opacity: 0.5,
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
      <div className={classes.content}>
        <Box className={classes.drawer}>
          <div className={classes.header}>
            <Tooltip title={t('sharedBack')}>
              <IconButton
                className={classes.backButton}
                size="small"
                onClick={() => navigate(-1)}
              >
                <ArrowBackIosNewRoundedIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
            <Box className={classes.headerIcon}>
              <FenceIcon sx={{ fontSize: '1.1rem' }} />
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
                <IconButton
                  className={classes.uploadButton}
                  size="small"
                  component="span"
                >
                  <UploadFileIcon sx={{ fontSize: '1.1rem' }} />
                </IconButton>
              </Tooltip>
            </label>
          </div>
          <GeofencesList onGeofenceSelected={setSelectedGeofenceId} />
        </Box>
        <div className={classes.mapContainer}>
          <MapView>
            <MapGeofenceEdit selectedGeofenceId={selectedGeofenceId} />
          </MapView>
          <MapScale />
          <MapCurrentLocation />
          <MapGeocoder />
        </div>
      </div>
    </div>
  );
};

export default GeofencesPage;
