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
} from '@mui/material';
import { useTranslation } from '../../common/components/LocalizationProvider';
import SelectField from '../../common/components/SelectField';

const GeofenceCreateDialog = ({ open, onSave, onCancel }) => {
  const t = useTranslation();

  const [name, setName] = useState(t('sharedGeofence'));
  const [description, setDescription] = useState('');
  const [calendarId, setCalendarId] = useState(null);
  const [hide, setHide] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    const data = {
      name: name.trim(),
      description: description.trim() || undefined,
      calendarId: calendarId || undefined,
      attributes: { hide },
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
    setCalendarId(null);
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
        <SelectField
          label={t('sharedCalendar')}
          value={calendarId}
          onChange={(e) => setCalendarId(Number(e.target.value) || null)}
          endpoint="/api/calendars"
          fullWidth
        />
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
