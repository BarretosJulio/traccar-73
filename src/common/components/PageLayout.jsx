import { useState } from 'react';
import {
  AppBar,
  Breadcrumbs,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from './LocalizationProvider';
import BackIcon from './BackIcon';

const useStyles = makeStyles()((theme, { miniVariant }) => ({
  root: {
    height: '100%',
    display: 'flex',
    background: theme.palette.background.default,
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  desktopDrawer: {
    width: miniVariant ? `calc(${theme.spacing(8)} + 1px)` : theme.dimensions.drawerWidthDesktop,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    '@media print': {
      display: 'none',
    },
  },
  mobileDrawer: {
    width: theme.dimensions.drawerWidthTablet,
    '@media print': {
      display: 'none',
    },
  },
  mobileToolbar: {
    zIndex: 1,
    '@media print': {
      display: 'none',
    },
  },
  content: {
    flexGrow: 1,
    alignItems: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    [theme.breakpoints.down('sm')]: {
      paddingBottom: theme.spacing(2),
    },
  },
}));

const PageTitle = ({ breadcrumbs }) => {
  const theme = useTheme();
  const t = useTranslation();

  const desktop = useMediaQuery(theme.breakpoints.up('md'));

  if (desktop) {
    return (
      <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
        {t(breadcrumbs[0])}
      </Typography>
    );
  }
  return (
    <Breadcrumbs>
      {breadcrumbs.slice(0, -1).map((breadcrumb) => (
        <Typography variant="h6" color="inherit" key={breadcrumb} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          {t(breadcrumb)}
        </Typography>
      ))}
      <Typography variant="h6" color="textPrimary" sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
        {t(breadcrumbs[breadcrumbs.length - 1])}
      </Typography>
    </Breadcrumbs>
  );
};

const PageLayout = ({ menu, breadcrumbs, children }) => {
  const [miniVariant, setMiniVariant] = useState(false);
  const { classes } = useStyles({ miniVariant });
  const theme = useTheme();
  const navigate = useNavigate();

  const desktop = useMediaQuery(theme.breakpoints.up('md'));

  const [searchParams] = useSearchParams();

  const [openDrawer, setOpenDrawer] = useState(!desktop && searchParams.has('menu'));

  const toggleDrawer = () => setMiniVariant(!miniVariant);

  return (
    <div className={classes.root}>
      {desktop ? (
        <Drawer
          variant="permanent"
          className={classes.desktopDrawer}
          classes={{ paper: classes.desktopDrawer }}
          PaperProps={{
            sx: {
              borderRight: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
            },
          }}
        >
          <Toolbar>
            {!miniVariant && (
              <>
                <IconButton
                  color="inherit"
                  edge="start"
                  sx={{ mr: 2 }}
                  onClick={() => navigate('/')}
                >
                  <BackIcon />
                </IconButton>
                <PageTitle breadcrumbs={breadcrumbs} />
              </>
            )}
            <IconButton
              color="inherit"
              edge="start"
              sx={{ ml: miniVariant ? -2 : 'auto' }}
              onClick={toggleDrawer}
            >
              {miniVariant !== (theme.direction === 'rtl') ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </Toolbar>
          <Divider />
          {menu}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          classes={{ paper: classes.mobileDrawer }}
        >
          {menu}
        </Drawer>
      )}
      {!desktop && (
        <AppBar className={classes.mobileToolbar} position="static" color="inherit" elevation={0}
          sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Toolbar sx={{ minHeight: { xs: 52, sm: 64 }, px: { xs: 1, sm: 2 } }}>
            <IconButton
              color="inherit"
              edge="start"
              sx={{ mr: 1 }}
              onClick={() => navigate(-1)}
            >
              <ArrowBackIcon />
            </IconButton>
            <PageTitle breadcrumbs={breadcrumbs} />
            <IconButton
              color="inherit"
              sx={{ ml: 'auto' }}
              onClick={() => setOpenDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}
      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default PageLayout;
