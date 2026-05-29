import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box } from '@mui/material';

const UnsavedChangesDialog = ({ open, onStay, onLeave }) => (
  <Dialog open={open} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <WarningAmberIcon color="warning" />
      Unsaved Changes
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        You have unsaved changes on this step. If you leave now, your changes will be
        lost. Do you want to stay and save, or leave without saving?
      </DialogContentText>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onLeave} color="inherit" variant="outlined" size="small">
        Leave without saving
      </Button>
      <Button onClick={onStay} variant="contained" size="small">
        Stay & save
      </Button>
    </DialogActions>
  </Dialog>
);

export default UnsavedChangesDialog;
