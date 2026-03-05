import { useMediaQuery, Paper, Box, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTheme } from '@mui/material/styles';
import LogoImage from './LogoImage';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
      : 'linear-gradient(135deg, #f0fdfa 0%, #f5f7fa 50%, #ecfdf5 100%)',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg, #134e4a 0%, #0f766e 50%, #115e59 100%)'
      : 'linear-gradient(180deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)',
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
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(0, 25, 0, 0),
    },
  },
  form: {
    maxWidth: theme.spacing(52),
    padding: theme.spacing(5),
    width: '100%',
  },
}));

const LoginLayout = ({ children }) => {
  const { classes } = useStyles();
  const theme = useTheme();

  return (
    <main className={classes.root}>
      <div className={classes.sidebar}>
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
      <Paper className={classes.paper}>
        <form className={classes.form}>{children}</form>
      </Paper>
    </main>
  );
};

export default LoginLayout;
