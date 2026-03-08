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
  ToggleButton,
  ToggleButtonGroup,
  RadioGroup,
  Radio,
} from '@mui/material';
import { useTranslation } from '../../common/components/LocalizationProvider';

const DAYS = [
  { value: 'mon', label: 'S' },
  { value: 'tue', label: 'T' },
  { value: 'wed', label: 'Q' },
  { value: 'thu', label: 'Q' },
  { value: 'fri', label: 'S' },
  { value: 'sat', label: 'S' },
  { value: 'sun', label: 'D' },
];

const ALL_DAYS = DAYS.map((d) => d.value);
const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri'];

const GeofenceCreateDialog = ({ open, onSave, onCancel }) => {
  const t = useTranslation();

  const [name, setName] = useState(t('sharedGeofence'));
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [dayMode, setDayMode] = useState('all');
  const [selectedDays, setSelectedDays] = useState([...ALL_DAYS]);
  const [hide, setHide] = useState(false);

  const handleDayModeChange = (e) => {
    const mode = e.target.value;
    setDayMode(mode);
    if (mode === 'all') setSelectedDays([...ALL_DAYS]);
    else if (mode === 'weekdays') setSelectedDays([...WEEKDAYS]);
    // 'custom' keeps current selection
  };

  const handleDayToggle = (_, newDays) => {
    if (newDays.length > 0) {
      setSelectedDays(newDays);
      // auto-detect mode
      if (newDays.length === 7) setDayMode('all');
      else if (
        newDays.length === 5 &&
        WEEKDAYS.every((d) => newDays.includes(d))
      ) setDayMode('weekdays');
      else setDayMode('custom');
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const attributes = { hide };
    if (startDate) attributes.startDate = startDate;
    if (endDate) attributes.endDate = endDate;
    if (startTime) attributes.startTime = startTime;
    if (endTime) attributes.endTime = endTime;
    attributes.activeDays = selectedDays;

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
    setDayMode('all');
    setSelectedDays([...ALL_DAYS]);
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
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
          Dias da semana
        </Typography>
        <RadioGroup row value={dayMode} onChange={handleDayModeChange} sx={{ gap: 1 }}>
          <FormControlLabel
            value="all"
            control={<Radio size="small" />}
            label={<Typography variant="body2">Todos os dias</Typography>}
          />
          <FormControlLabel
            value="weekdays"
            control={<Radio size="small" />}
            label={<Typography variant="body2">Seg a Sex</Typography>}
          />
          <FormControlLabel
            value="custom"
            control={<Radio size="small" />}
            label={<Typography variant="body2">Personalizado</Typography>}
          />
        </RadioGroup>
        <ToggleButtonGroup
          value={selectedDays}
          onChange={handleDayToggle}
          size="small"
          sx={{
            display: 'flex',
            gap: 0.5,
            '& .MuiToggleButton-root': {
              flex: 1,
              borderRadius: '8px !important',
              border: '1px solid',
              borderColor: 'divider',
              fontSize: '0.75rem',
              fontWeight: 600,
              py: 0.75,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                borderColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            },
          }}
        >
          {DAYS.map((day, idx) => (
            <ToggleButton key={day.value} value={day.value}>
              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][idx]}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
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
