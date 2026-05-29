import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';

const CreateSubmissionDialog = ({ open, onClose, onCreate, isLoading, error }) => {
  const [title, setTitle] = useState('');
  const [touched, setTouched] = useState(false);

  const handleSubmit = () => {
    setTouched(true);
    if (!title.trim()) return;
    onCreate(title.trim());
  };

  const handleClose = () => {
    setTitle('');
    setTouched(false);
    onClose();
  };

  const titleError = touched && !title.trim() ? 'Title is required' : '';

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontFamily: '"DM Serif Display", serif', fontWeight: 400 }}>
        New Submission
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          autoFocus
          fullWidth
          label="Submission Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          error={Boolean(titleError)}
          helperText={titleError || 'Give this submission a recognisable name'}
          sx={{ mt: 1 }}
          disabled={isLoading}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit" disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={14} color="inherit" /> : null}
        >
          {isLoading ? 'Creating…' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSubmissionDialog;
