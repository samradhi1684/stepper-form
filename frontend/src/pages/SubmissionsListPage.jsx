import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useSubmissions, useCreateSubmission } from '../hooks/useSubmissions';
import SubmissionCard from '../components/submissions/SubmissionCard';
import CreateSubmissionDialog from '../components/submissions/CreateSubmissionDialog';

const SubmissionsListPage = () => {
  const navigate = useNavigate();
  const { data: submissions, isLoading, isError, error } = useSubmissions();
  const createMutation = useCreateSubmission();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createError, setCreateError] = useState(null);

  const handleCreate = async (title) => {
    setCreateError(null);
    try {
      const submission = await createMutation.mutateAsync({ title });
      setDialogOpen(false);
      navigate(`/submissions/${submission._id}`);
    } catch (err) {
      setCreateError(err?.response?.data?.error || 'Failed to create submission');
    }
  };

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto', px: 3, py: 5 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Box>
          <Typography variant="h4" color="primary.dark" gutterBottom>
            Form Submissions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track and manage your wellness intake submissions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setCreateError(null);
            setDialogOpen(true);
          }}
          sx={{ flexShrink: 0 }}
        >
          New Submission
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* States */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error?.response?.data?.error || 'Failed to load submissions. Is the backend running?'}
        </Alert>
      )}

      {!isLoading && !isError && submissions?.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 10,
            color: 'text.secondary',
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            No submissions yet
          </Typography>
          <Typography variant="body2" mb={3}>
            Create your first wellness intake submission
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            New Submission
          </Button>
        </Box>
      )}

      {!isLoading && submissions?.length > 0 && (
        <Grid container spacing={2}>
          {submissions.map((s) => (
            <Grid item xs={12} sm={6} key={s._id}>
              <SubmissionCard
                submission={s}
                onClick={() => navigate(`/submissions/${s._id}`)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <CreateSubmissionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreate}
        isLoading={createMutation.isPending}
        error={createError}
      />
    </Box>
  );
};

export default SubmissionsListPage;
