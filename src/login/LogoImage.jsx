import { useTheme, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
import Logo from '../resources/images/logo.svg?react';
import { useTenant } from '../common/components/TenantProvider';

const useStyles = makeStyles()((theme) => ({
  image: {
    alignSelf: 'center',
    maxWidth: '100%',
    maxHeight: '120px',
    width: 'auto',
    height: 'auto',
    margin: theme.spacing(2),
    objectFit: 'contain',
  },
}));

const LogoImage = ({ color }) => {
  const theme = useTheme();
  const { classes } = useStyles();

  const expanded = !useMediaQuery(theme.breakpoints.down('lg'));

  const tenantCtx = useTenant();
  const tenantLogo = tenantCtx?.tenant?.logo_url;

  const logo = useSelector((state) => state.session.server?.attributes?.logo);
  const logoInverted = useSelector((state) => state.session.server?.attributes?.logoInverted);

  // Priority: tenant logo > Traccar server logo > default SVG
  const effectiveLogo = tenantLogo || logo;
  const effectiveInverted = tenantLogo || logoInverted;

  if (effectiveLogo) {
    if (expanded && effectiveInverted) {
      return <img className={classes.image} src={effectiveInverted} alt="" />;
    }
    return <img className={classes.image} src={effectiveLogo} alt="" />;
  }
  return <Logo className={classes.image} style={{ color }} />;
};

export default LogoImage;
