import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Button,
  Autocomplete,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Snackbar,
  Alert,
  Paper,
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ErrorIcon from '@mui/icons-material/Error';
import { useTranslation } from '../common/components/LocalizationProvider';
import BaseCommandView from './components/BaseCommandView';
import PageLayout from '../common/components/PageLayout';
import SettingsMenu from './components/SettingsMenu';
import { useCatch, useEffectAsync } from '../reactHelper';
import useSettingsStyles from './common/useSettingsStyles';
import fetchOrThrow from '../common/util/fetchOrThrow';
import { prefixString } from '../common/util/stringUtils';
import dayjs from 'dayjs';

const CommandCenterPage = () => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();

  const devices = useSelector((state) => state.devices.items);
  const deviceList = Object.values(devices);

  const [selectedDevice, setSelectedDevice] = useState(null);
  const [savedId, setSavedId] = useState(0);
  const [item, setItem] = useState({});
  const [commandLog, setCommandLog] = useState([]);
  const [loadingLog, setLoadingLog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchCommandLog = useCallback(async (deviceId) => {
    if (!deviceId) {
      setCommandLog([]);
      return;
    }
    setLoadingLog(true);
    try {
      const from = dayjs().subtract(7, 'day').toISOString();
      const to = dayjs().toISOString();

      const [eventsRes] = await Promise.all([
        fetchOrThrow(`/api/reports/events?deviceId=${deviceId}&type=commandResult&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, {
          headers: { Accept: 'application/json' },
        }),
      ]);

      const events = await eventsRes.json();

      const logEntries = events.map((ev) => ({
        id: ev.id,
        time: ev.eventTime || ev.serverTime,
        type: ev.type,
        description: ev.attributes?.result || ev.attributes?.command || t('commandResponse'),
        status: 'received',
      }));

      logEntries.sort((a, b) => new Date(b.time) - new Date(a.time));
      setCommandLog(logEntries);
    } catch {
      setCommandLog([]);
    } finally {
      setLoadingLog(false);
    }
  }, [t]);

  useEffectAsync(async () => {
    if (selectedDevice) {
      await fetchCommandLog(selectedDevice.id);
    }
  }, [selectedDevice]);

  const handleSend = useCatch(async () => {
    let command;
    if (savedId) {
      const response = await fetchOrThrow(`/api/commands/${savedId}`);
      command = await response.json();
    } else {
      command = item;
    }

    command.deviceId = selectedDevice.id;

    await fetchOrThrow('/api/commands/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(command),
    });

    setSnackbar({ open: true, message: t('commandSent'), severity: 'success' });
    setSavedId(0);
    setItem({});

    // Refresh log after short delay
    setTimeout(() => fetchCommandLog(selectedDevice.id), 2000);
  });

  const handleDeviceChange = (_, value) => {
    setSelectedDevice(value);
    setSavedId(0);
    setItem({});
  };

  const validate = () => selectedDevice && (savedId || (item && item.type));

  const getStatusChip = (status) => {
    switch (status) {
      case 'received':
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label={t('commandDelivered')}
            color="success"
            size="small"
            variant="outlined"
          />
        );
      case 'pending':
        return (
          <Chip
            icon={<HourglassEmptyIcon />}
            label={t('commandPending')}
            color="warning"
            size="small"
            variant="outlined"
          />
        );
      case 'failed':
        return (
          <Chip
            icon={<ErrorIcon />}
            label={t('commandFailed')}
            color="error"
            size="small"
            variant="outlined"
          />
        );
      default:
        return <Chip label={status} size="small" variant="outlined" />;
    }
  };

  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={['settingsTitle', 'commandCenter']}>
      <Container maxWidth="md" className={classes.container}>
        {/* Device Selector */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">{t('commandCenter')}</Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <Autocomplete
              size="small"
              options={deviceList}
              getOptionLabel={(option) => option.name || ''}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              value={selectedDevice}
              onChange={handleDeviceChange}
              renderInput={(params) => (
                <TextField {...params} label={t('reportDevice')} />
              )}
            />

            {selectedDevice && (
              <BaseCommandView
                deviceId={selectedDevice.id}
                item={item}
                setItem={setItem}
                includeSaved
                savedId={savedId}
                setSavedId={setSavedId}
              />
            )}
          </AccordionDetails>
        </Accordion>

        {/* Send Button */}
        <div className={classes.buttons}>
          <Button
            type="button"
            color="primary"
            variant="outlined"
            onClick={() => {
              setSelectedDevice(null);
              setSavedId(0);
              setItem({});
              setCommandLog([]);
            }}
          >
            {t('sharedCancel')}
          </Button>
          <Button
            type="button"
            color="primary"
            variant="contained"
            onClick={handleSend}
            disabled={!validate()}
            startIcon={<SendIcon />}
          >
            {t('commandSend')}
          </Button>
        </div>

        {/* Command History */}
        {selectedDevice && (
          <Paper sx={{ mt: 2, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5 }}>
              <Typography variant="subtitle1">{t('commandHistory')}</Typography>
              <Tooltip title={t('sharedRefresh') || 'Refresh'}>
                <IconButton
                  size="small"
                  onClick={() => fetchCommandLog(selectedDevice.id)}
                  disabled={loadingLog}
                >
                  {loadingLog ? <CircularProgress size={20} /> : <RefreshIcon />}
                </IconButton>
              </Tooltip>
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('sharedDate') || 'Data'}</TableCell>
                  <TableCell>{t('sharedDescription') || 'Descrição'}</TableCell>
                  <TableCell>{t('commandStatus')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {commandLog.length === 0 && !loadingLog ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                        {t('sharedNoData')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  commandLog.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        {dayjs(entry.time).format('DD/MM/YYYY HH:mm:ss')}
                      </TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell>{getStatusChip(entry.status)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageLayout>
  );
};

export default CommandCenterPage;
