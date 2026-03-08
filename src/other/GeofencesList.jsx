import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
import { List, ListItemButton, ListItemText, Typography, Box } from '@mui/material';
import FenceIcon from '@mui/icons-material/Fence';

import { geofencesActions } from '../store';
import CollectionActions from '../settings/components/CollectionActions';
import { useCatchCallback } from '../reactHelper';
import fetchOrThrow from '../common/util/fetchOrThrow';
import { useTranslation } from '../common/components/LocalizationProvider';

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
  itemName: {
    fontWeight: 500,
    fontSize: '0.875rem',
    color: theme.palette.text.primary,
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
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const t = useTranslation();

  const items = useSelector((state) => state.geofences.items);
  const geofenceList = Object.values(items);

  const refreshGeofences = useCatchCallback(async () => {
    const response = await fetchOrThrow('/api/geofences');
    dispatch(geofencesActions.refresh(await response.json()));
  }, [dispatch]);

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
    <List className={classes.list} disablePadding>
      {geofenceList.map((item) => (
        <ListItemButton
          key={item.id}
          className={classes.listItem}
          onClick={() => onGeofenceSelected(item.id)}
        >
          <Box className={classes.itemIcon}>
            <FenceIcon sx={{ fontSize: '1rem' }} />
          </Box>
          <ListItemText
            primary={item.name}
            primaryTypographyProps={{
              className: classes.itemName,
              noWrap: true,
            }}
          />
          <CollectionActions
            itemId={item.id}
            editPath="/app/settings/geofence"
            endpoint="geofences"
            setTimestamp={refreshGeofences}
          />
        </ListItemButton>
      ))}
    </List>
  );
};

export default GeofencesList;
