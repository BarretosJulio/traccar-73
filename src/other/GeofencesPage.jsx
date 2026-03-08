import { useState, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  Typography,
  IconButton,
  Tooltip,
  Box,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
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
  /* Desktop floating overlay */
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 1200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    backdropFilter: 'blur(6px)',
    padding: theme.spacing(3),
  },
  floatingCard: {
    width: 1100,
    height: '85vh',
    borderRadius: 20,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 24px 80px rgba(0,0,0,0.25), 0 8px 32px rgba(0,0,0,0.15)',
    backgroundColor: theme.palette.background.paper,
  },
  floatingHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1.5, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    minHeight: 56,
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
  floatingBody: {
    display: 'flex',
    flexGrow: 1,
    overflow: 'hidden',
    minHeight: 0,
  },
  floatingSidebar: {
    width: 320,
    minWidth: 320,
    borderRight: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    backgroundColor: theme.palette.background.default,
  },
  floatingMap: {
    flexGrow: 1,
    minWidth: 0,
    position: 'relative',
  },
  /* Mobile fullscreen */
  mobileRoot: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  mobileContent: {
    flexGrow: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  mobileDrawer: {
    height: theme.dimensions.drawerHeightPhone,
    display: 'flex',
    flexDirection: 'column',
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
  mobileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1, 1.5),
    borderBottom: `1px solid ${theme.palette.divider}`,
    minHeight: 48,
  },
  mobileMapContainer: {
    flexGrow: 1,
    position: 'relative',
  },
  title: {
    flexGrow: 1,
    fontWeight: 700,
    fontSize: '1rem',
    letterSpacing: '-0.01em',
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
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const closingRef = useRef(false);

  const [selectedGeofenceId, setSelectedGeofenceId] = useState();

  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setTimeout(() => navigate(-1), 0);
  }, [navigate]);

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

  const uploadButton = (
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
  );

  const mapContent = (
    <>
      <MapView>
        <MapGeofenceEdit selectedGeofenceId={selectedGeofenceId} />
      </MapView>
      <MapScale />
      <MapCurrentLocation />
      <MapGeocoder />
    </>
  );

  if (desktop) {
    return (
      <div className={classes.overlay} onClick={handleClose}>
        <Paper
          className={classes.floatingCard}
          elevation={24}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={classes.floatingHeader}>
            <Tooltip title={t('sharedBack')}>
              <IconButton className={classes.actionButton} size="small" onClick={handleClose}>
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Box className={classes.headerIcon}>
              <FenceIcon sx={{ fontSize: '1.1rem' }} />
            </Box>
            <Typography className={classes.title}>
              {t('sharedGeofences')}
            </Typography>
            {uploadButton}
            <Tooltip title={t('sharedHide')}>
              <IconButton className={classes.actionButton} size="small" onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
          <div className={classes.floatingBody}>
            <div className={classes.floatingSidebar}>
              <GeofencesList onGeofenceSelected={setSelectedGeofenceId} />
            </div>
            <div className={classes.floatingMap}>
              {mapContent}
            </div>
          </div>
        </Paper>
      </div>
    );
  }

  return (
    <div className={classes.mobileRoot}>
      <div className={classes.mobileContent}>
        <Box className={classes.mobileDrawer}>
          <div className={classes.mobileHeader}>
            <Tooltip title={t('sharedBack')}>
              <IconButton className={classes.actionButton} size="small" onClick={() => navigate(-1)}>
                <ArrowBackIcon sx={{ fontSize: '1.1rem' }} />
              </IconButton>
            </Tooltip>
            <Box className={classes.headerIcon} sx={{ width: 30, height: 30 }}>
              <FenceIcon sx={{ fontSize: '0.95rem' }} />
            </Box>
            <Typography className={classes.title}>
              {t('sharedGeofences')}
            </Typography>
            {uploadButton}
          </div>
          <GeofencesList onGeofenceSelected={setSelectedGeofenceId} />
        </Box>
        <div className={classes.mobileMapContainer}>
          {mapContent}
        </div>
      </div>
    </div>
  );
};

export default GeofencesPage;
