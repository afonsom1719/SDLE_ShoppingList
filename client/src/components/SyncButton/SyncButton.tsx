import React from 'react';
import Button from '@mui/material/Button';
import SyncIcon from '@mui/icons-material/Sync';

interface SyncButtonProps {
  isSynced: boolean;
  onSyncClick: () => void;
}

const SyncButton: React.FC<SyncButtonProps> = ({ isSynced, onSyncClick }) => {
  const buttonStyle = isSynced
    ? { borderRadius: '10px', backgroundColor: '#ff9900', color: 'white' }
    : { borderRadius: '10px' };

  return (
    <Button
      onClick={onSyncClick}
      style={buttonStyle}
      startIcon={<SyncIcon />}
    >
      {isSynced ? 'Synced' : 'Sync'}
    </Button>
  );
};

export default SyncButton;
