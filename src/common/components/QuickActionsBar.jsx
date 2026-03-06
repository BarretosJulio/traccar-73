import { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AnchorIcon from '@mui/icons-material/Anchor';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from './LocalizationProvider';
import { useDeviceReadonly, useRestriction } from '../util/permissions';
import { errorsActions } from '../../store';
import fetchOrThrow from '../util/fetchOrThrow';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    gap: 4,
    padding: '4px 0',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'scale(1.08)',
    },
    '& .MuiSvgIcon-root': {
      fontSize: '0.95rem',
    },
  },
  blockBtn: {
    borderColor: '#ef444440',
    backgroundColor: '#ef444410',
    color: '#ef4444',
    '&:hover': { backgroundColor: '#ef444420' },
  },
  unblockBtn: {
    borderColor: '#10b98140',
    backgroundColor: '#10b98110',
    color: '#10b981',
    '&:hover': { backgroundColor: '#10b98120' },
  },
  anchorBtn: {
    borderColor: '#8b5cf640',
    backgroundColor: '#8b5cf610',
    color: '#8b5cf6',
    '&:hover': { backgroundColor: '#8b5cf620' },
  },
  locateBtn: {
    borderColor: '#3b82f640',
    backgroundColor: '#3b82f610',
    color: '#3b82f6',
    '&:hover': { backgroundColor: '#3b82f620' },
  },
}));

const QuickActionsBar = ({ deviceId, position, attrs = {} }) => {
  const { classes, cx } = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();

  const readonly = useRestriction('readonly');
  const deviceReadonly = useDeviceReadonly();

  const [supportedTypes, setSupportedTypes] = useState([]);
  const [loading, setLoading] = useState({});
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Fetch supported command types for device
  useEffect(() => {
    let cancelled = false;
    const fetchTypes = async () => {
      try {
        const response = await fetchOrThrow(`/api/commands/types?deviceId=${deviceId}`);
        const types = await response.json();
        if (!cancelled) {
          setSupportedTypes(types.map((t) => t.type));
        }
      } catch {
        // Device may not support commands
        if (!cancelled) setSupportedTypes([]);
      }
    };
    if (deviceId) fetchTypes();
    return () => { cancelled = true; };
  }, [deviceId]);

  const sendCommand = async (type, attributes = {}) => {
    setLoading((prev) => ({ ...prev, [type]: true }));
    try {
      await fetchOrThrow('/api/commands/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, type, attributes }),
      });
      setFeedback({ severity: 'success', message: `Comando "${type}" enviado com sucesso` });
      console.info(`[AUDIT] Command sent: ${type} to device ${deviceId}`, { type, deviceId, attributes });
    } catch (error) {
      setFeedback({ severity: 'error', message: `Erro ao enviar comando: ${error.message}` });
      dispatch(errorsActions.push(error.message));
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleEngineAction = () => {
    const action = attrs.blocked ? 'engineResume' : 'engineStop';
    const label = attrs.blocked ? 'Desbloquear Motor' : 'Bloquear Motor';
    setConfirmDialog({
      title: label,
      message: attrs.blocked
        ? 'Deseja desbloquear o motor deste veículo? O motor poderá ser ligado novamente.'
        : 'Deseja bloquear o motor deste veículo? O motor será cortado remotamente.',
      onConfirm: () => {
        setConfirmDialog(null);
        sendCommand(action);
      },
    });
  };

  const handleAnchor = async () => {
    if (!position) return;
    setLoading((prev) => ({ ...prev, anchor: true }));
    try {
      const newItem = {
        name: `Âncora - ${new Date().toLocaleString('pt-BR')}`,
        area: `CIRCLE (${position.latitude} ${position.longitude}, 100)`,
      };
      const response = await fetchOrThrow('/api/geofences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      const item = await response.json();
      await fetchOrThrow('/api/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId: position.deviceId, geofenceId: item.id }),
      });
      setFeedback({ severity: 'success', message: 'Âncora criada com sucesso (raio de 100m)' });
      console.info(`[AUDIT] Anchor geofence created for device ${deviceId}`, { geofenceId: item.id });
    } catch (error) {
      setFeedback({ severity: 'error', message: `Erro ao criar âncora: ${error.message}` });
      dispatch(errorsActions.push(error.message));
    } finally {
      setLoading((prev) => ({ ...prev, anchor: false }));
    }
  };

  const handleLocate = () => {
    sendCommand('positionSingle');
  };

  if (readonly || deviceReadonly) return null;

  const hasEngine = supportedTypes.includes('engineStop') || supportedTypes.includes('engineResume');
  const hasLocate = supportedTypes.includes('positionSingle');

  // Always show anchor (geofence-based, not command-based)
  const showAnchor = !!position;

  if (!hasEngine && !hasLocate && !showAnchor) return null;

  return (
    <>
      <Box className={classes.root}>
        {hasEngine && (
          <Tooltip title={attrs.blocked ? 'Desbloquear Motor' : 'Bloquear Motor'} arrow>
            <span>
              <IconButton
                className={cx(classes.actionButton, attrs.blocked ? classes.unblockBtn : classes.blockBtn)}
                onClick={handleEngineAction}
                disabled={!!loading.engineStop || !!loading.engineResume}
              >
                {(loading.engineStop || loading.engineResume)
                  ? <CircularProgress size={14} />
                  : attrs.blocked ? <LockOpenIcon /> : <LockIcon />
                }
              </IconButton>
            </span>
          </Tooltip>
        )}

        {showAnchor && (
          <Tooltip title="Criar Âncora (Geofence 100m)" arrow>
            <span>
              <IconButton
                className={cx(classes.actionButton, classes.anchorBtn)}
                onClick={handleAnchor}
                disabled={!!loading.anchor}
              >
                {loading.anchor ? <CircularProgress size={14} /> : <AnchorIcon />}
              </IconButton>
            </span>
          </Tooltip>
        )}

        {hasLocate && (
          <Tooltip title="Solicitar Posição" arrow>
            <span>
              <IconButton
                className={cx(classes.actionButton, classes.locateBtn)}
                onClick={handleLocate}
                disabled={!!loading.positionSingle}
              >
                {loading.positionSingle ? <CircularProgress size={14} /> : <GpsFixedIcon />}
              </IconButton>
            </span>
          </Tooltip>
        )}
      </Box>

      {/* Confirmation dialog */}
      <Dialog open={!!confirmDialog} onClose={() => setConfirmDialog(null)} maxWidth="xs">
        <DialogTitle>{confirmDialog?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialog?.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(null)}>Cancelar</Button>
          <Button onClick={confirmDialog?.onConfirm} color="error" variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback snackbar */}
      <Snackbar
        open={!!feedback}
        autoHideDuration={4000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {feedback && (
          <Alert severity={feedback.severity} onClose={() => setFeedback(null)} variant="filled" sx={{ fontSize: '0.75rem' }}>
            {feedback.message}
          </Alert>
        )}
      </Snackbar>
    </>
  );
};

export default QuickActionsBar;
