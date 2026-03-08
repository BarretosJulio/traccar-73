import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
} from '@mui/material';
import { useTranslation } from '../../common/components/LocalizationProvider';

const GeofenceCreateDialog = ({ open, onSave, onCancel }) => {
  const t = useTranslation();

  const [name, setName] = useState(t('sharedGeofence'));
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [hide, setHide] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    const attributes = { hide };
    if (startDate) attributes.startDate = startDate;
    if (endDate) attributes.endDate = endDate;
    if (startTime) attributes.startTime = startTime;
    if (endTime) attributes.endTime = endTime;

    const data = {
      name: name.trim(),
      description: description.trim() || undefined,
      attributes,
    };
    onSave(data);
    resetForm();
  };

  const handleCancel = () => {
    onCancel();
    resetForm();
  };

  const resetForm = () => {
    setName(t('sharedGeofence'));
    setDescription('');
    setStartDate('');
    setEndDate('');
    setStartTime('');
    setEndTime('');
    setHide(false);
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{t('sharedGeofence')}</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}
      >
        <TextField
          label={t('sharedName')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
          fullWidth
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          Período de ativação (opcional)
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <TextField
            label="Data início"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Data fim"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <TextField
            label="Hora início"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Hora fim"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <TextField
          label={t('sharedDescription')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={2}
        />
        <FormControlLabel
          control={<Checkbox checked={hide} onChange={(e) => setHide(e.target.checked)} />}
          label={t('sharedFilterMap')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>{t('sharedCancel')}</Button>
        <Button onClick={handleSave} variant="contained" disabled={!name.trim()}>
          {t('sharedSave')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GeofenceCreateDialog;
