import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Box,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatNotificationTitle, formatTime } from '../common/util/formatter';
import { useTranslation } from '../common/components/LocalizationProvider';
import { eventsActions } from '../store';

const useStyles = makeStyles()((theme) => ({
  drawer: {
    width: theme.dimensions.eventsDrawerWidth,
  },
  toolbar: {
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontWeight: 700,
  },
}));

const EventsDrawer = ({ open, onClose }) => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();

  const devices = useSelector((state) => state.devices.items);

  const events = useSelector((state) => state.events.items);

  const formatType = (event) =>
    formatNotificationTitle(t, {
      type: event.type,
      attributes: {
        alarms: event.attributes.alarm,
      },
    });

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Toolbar className={classes.toolbar} disableGutters>
        <Typography variant="h6" className={classes.title}>
          {t('reportEvents')}
        </Typography>
        <IconButton
          size="small"
          color="inherit"
          onClick={() => dispatch(eventsActions.deleteAll())}
          sx={{ borderRadius: '10px' }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Toolbar>
      <List className={classes.drawer} dense>
        {events.map((event) => (
          <ListItemButton
            key={event.id}
            onClick={() => navigate(`/app/event/${event.id}`)}
            disabled={!event.id}
            sx={{ borderRadius: '12px', mx: 1, mb: 0.5 }}
          >
            <ListItemText
              primary={`${devices[event.deviceId]?.name} • ${formatType(event)}`}
              secondary={formatTime(event.eventTime, 'seconds')}
              slotProps={{
                primary: { sx: { fontWeight: 600, fontSize: '0.8125rem' } },
                secondary: { sx: { fontSize: '0.75rem' } },
              }}
            />
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(eventsActions.delete(event));
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default EventsDrawer;
