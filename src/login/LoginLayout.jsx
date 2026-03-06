import { useMediaQuery, Paper, Box, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTheme } from '@mui/material/styles';
import LogoImage from './LogoImage';
import { useTenant } from '../common/components/TenantProvider';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: theme.spacing(5),
    width: theme.dimensions.sidebarWidth,
    position: 'relative',
    overflow: 'hidden',
    [theme.breakpoints.down('lg')]: {
      width: theme.dimensions.sidebarWidthTablet,
    },
    [theme.breakpoints.down('sm')]: {
      width: '0px',
    },
  },
  sidebarOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at 30% 80%, rgba(255,255,255,0.08) 0%, transparent 60%)',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: 0,
    boxShadow: 'none',
    position: 'relative',
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(0, 25, 0, 0),
    },
  },
  bgOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 0,
  },
  form: {
    maxWidth: theme.spacing(52),
    padding: theme.spacing(5),
    width: '100%',
    position: 'relative',
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3, 2.5),
      maxWidth: '100%',
    },
  },
}));

const LoginLayout = ({ children }) => {
  const { classes } = useStyles();
  const theme = useTheme();
  const tenantCtx = useTenant();
  const tenant = tenantCtx?.tenant;

  const sidebarColor = tenant?.login_sidebar_color || tenant?.color_primary || (theme.palette.mode === 'dark' ? '#134e4a' : '#0f766e');
  const bgImage = tenant?.login_bg_image;
  const bgColor = tenant?.login_bg_color;

  const sidebarBg = `linear-gradient(180deg, ${sidebarColor} 0%, ${sidebarColor}dd 50%, ${sidebarColor}bb 100%)`;

  const rootBg = theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
    : 'linear-gradient(135deg, #f0fdfa 0%, #f5f7fa 50%, #ecfdf5 100%)';

  const paperStyle = {};
  if (bgImage) {
    paperStyle.backgroundImage = `url(${bgImage})`;
    paperStyle.backgroundSize = 'cover';
    paperStyle.backgroundPosition = 'center';
  } else if (bgColor) {
    paperStyle.backgroundColor = bgColor;
  }

  return (
    <main className={classes.root} style={{ background: rootBg }}>
      <div className={classes.sidebar} style={{ background: sidebarBg }}>
        <div className={classes.sidebarOverlay} />
        {!useMediaQuery(theme.breakpoints.down('lg')) && (
          <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <LogoImage color="#ffffff" />
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                mt: 2,
                fontWeight: 400,
                letterSpacing: '0.05em',
              }}
            >
              Rastreamento Inteligente
            </Typography>
          </Box>
        )}
      </div>
      <Paper className={classes.paper} style={paperStyle}>
        {bgImage && <div className={classes.bgOverlay} />}
        <form className={classes.form}>{children}</form>
      </Paper>
    </main>
  );
};

export default LoginLayout;
