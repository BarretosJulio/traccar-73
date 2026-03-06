import { Tooltip, Box } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useNavigate } from 'react-router-dom';
import DevicesIcon from '@mui/icons-material/Devices';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import FenceIcon from '@mui/icons-material/Fence';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BuildIcon from '@mui/icons-material/Build';
import SettingsIcon from '@mui/icons-material/Settings';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import StorageIcon from '@mui/icons-material/Storage';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useAdministrator } from '../common/util/permissions';

const useStyles = makeStyles()((theme) => ({
  root: {
    position: 'fixed',
    right: 10,
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    padding: '8px 4px',
    borderRadius: 14,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
    border: `1px solid ${theme.palette.divider}`,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 10,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: theme.palette.text.secondary,
    '&:hover': {
      backgroundColor: `${theme.palette.primary.main}15`,
      color: theme.palette.primary.main,
      transform: 'scale(1.1)',
    },
  },
  icon: {
    fontSize: '1.25rem',
  },
}));

const MapSideMenu = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const t = useTranslation();
  const admin = useAdministrator();

  const items = [
    { label: 'Dashboard', icon: <DashboardIcon className={classes.icon} />, path: '/app' },
    { label: t('deviceTitle'), icon: <DevicesIcon className={classes.icon} />, path: '/app/settings/devices' },
    { label: t('settingsGroups'), icon: <GroupsIcon className={classes.icon} />, path: '/app/settings/groups' },
    { label: t('sharedDrivers'), icon: <PersonIcon className={classes.icon} />, path: '/app/settings/drivers' },
    { label: 'Cercas', icon: <FenceIcon className={classes.icon} />, path: '/app/geofences' },
    { label: t('sharedNotifications'), icon: <NotificationsIcon className={classes.icon} />, path: '/app/settings/notifications' },
    { label: t('sharedMaintenance'), icon: <BuildIcon className={classes.icon} />, path: '/app/settings/maintenances' },
    { label: t('sharedPreferences'), icon: <SettingsIcon className={classes.icon} />, path: '/app/settings/preferences' },
    { label: t('reportTitle'), icon: <DescriptionIcon className={classes.icon} />, path: '/app/reports/combined' },
    ...(admin ? [
      { label: t('settingsUsers'), icon: <PeopleIcon className={classes.icon} />, path: '/app/settings/users' },
      { label: t('settingsServer'), icon: <StorageIcon className={classes.icon} />, path: '/app/settings/server' },
    ] : []),
  ];

  return (
    <div className={classes.root}>
      {items.map((item) => (
        <Tooltip key={item.path} title={item.label} placement="left" arrow>
          <Box
            className={classes.item}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
          </Box>
        </Tooltip>
      ))}
    </div>
  );
};

export default MapSideMenu;
