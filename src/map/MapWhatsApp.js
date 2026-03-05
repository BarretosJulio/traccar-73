import { useEffect, useMemo } from 'react';
import { useTheme } from '@mui/material';
import { map } from './core/MapView';

class WhatsAppControl {
  constructor(phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  onAdd() {
    this.button = document.createElement('button');
    this.button.className = 'maplibregl-ctrl-icon maplibre-ctrl-whatsapp';
    this.button.type = 'button';
    this.button.title = 'WhatsApp';
    this.button.onclick = () => {
      window.open(`https://wa.me/${this.phoneNumber}`, '_blank');
    };

    this.container = document.createElement('div');
    this.container.className = 'maplibregl-ctrl-group maplibregl-ctrl';
    this.container.appendChild(this.button);

    return this.container;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
  }
}

const MapWhatsApp = ({ phoneNumber = '5511999999999' }) => {
  const theme = useTheme();
  const control = useMemo(() => new WhatsAppControl(phoneNumber), [phoneNumber]);

  useEffect(() => {
    map.addControl(control, theme.direction === 'rtl' ? 'top-left' : 'top-right');
    return () => map.removeControl(control);
  }, [control, theme.direction]);

  return null;
};

export default MapWhatsApp;
