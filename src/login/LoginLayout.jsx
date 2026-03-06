import { useMediaQuery, Box, Typography } from '@mui/material';
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
    alignItems: 'center',
    width: theme.dimensions.sidebarWidth,
    position: 'relative',
    overflow: 'auto',
    padding: theme.spacing(4, 3),
    [theme.breakpoints.down('lg')]: {
      width: '100%',
    },
  },
  sidebarOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at 30% 80%, rgba(255,255,255,0.08) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  contentArea: {
    flex: 1,
    position: 'relative',
    [theme.breakpoints.down('lg')]: {
      display: 'none',
    },
  },
  bgOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.3)',
    zIndex: 0,
  },
  form: {
    width: '100%',
    maxWidth: '340px',
    position: 'relative',
    zIndex: 1,
    marginTop: theme.spacing(3),
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

  const contentStyle = {};
  if (bgImage) {
    contentStyle.backgroundImage = `url(${bgImage})`;
    contentStyle.backgroundSize = 'cover';
    contentStyle.backgroundPosition = 'center';
  } else if (bgColor) {
    contentStyle.backgroundColor = bgColor;
  } else {
    contentStyle.background = theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
      : 'linear-gradient(135deg, #f0fdfa 0%, #f5f7fa 50%, #ecfdf5 100%)';
  }

  return (
    <main className={classes.root}>
      <div className={classes.sidebar} style={{ background: sidebarBg }}>
        <div className={classes.sidebarOverlay} />
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', mt: 2 }}>
          <LogoImage color="#ffffff" />
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.7)',
              mt: 1,
              fontWeight: 400,
              letterSpacing: '0.05em',
            }}
          >
            Rastreamento Inteligente
          </Typography>
        </Box>
        <form className={classes.form}>{children}</form>
      </div>
      <div className={classes.contentArea} style={contentStyle}>
        {bgImage && <div className={classes.bgOverlay} />}
      </div>
    </main>
  );
};

export default LoginLayout;
