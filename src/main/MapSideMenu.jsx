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
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useState } from 'react';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useAdministrator } from '../common/util/permissions';
import WhatsAppAlertsDialog from '../settings/WhatsAppAlertsDialog';

const useStyles = makeStyles()((theme) => ({
  root: {
    position: 'fixed',
    right: 60,
    top: 10,
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'row',
    gap: 2,
    padding: '4px 8px',
    borderRadius: 12,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    border: `1px solid ${theme.palette.divider}`,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 9,
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
    fontSize: '1.15rem',
  },
}));

const MapSideMenu = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const t = useTranslation();
  const admin = useAdministrator();
  const [whatsappOpen, setWhatsappOpen] = useState(false);

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
      { label: t('whatsappSettings'), icon: <WhatsAppIcon className={classes.icon} />, onClick: () => setWhatsappOpen(true) },
    ] : []),
  ];

  return (
    <>
      <div className={classes.root}>
        {items.map((item) => (
          <Tooltip key={item.path || item.label} title={item.label} placement="left" arrow>
            <Box
              className={classes.item}
              onClick={item.onClick || (() => navigate(item.path))}
            >
              {item.icon}
            </Box>
          </Tooltip>
        ))}
      </div>
      <WhatsAppAlertsDialog open={whatsappOpen} onClose={() => setWhatsappOpen(false)} />
    </>
  );
};

export default MapSideMenu;
