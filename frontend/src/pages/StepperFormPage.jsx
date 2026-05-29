import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate, useParams, useBeforeUnload } from 'react-router-dom';
import {
  useSubmission,
  useFormConfig,
  useUpdateSubmission,
  useSubmitSubmission,
} from '../hooks/useSubmissions';
import StepForm from '../components/form/StepForm';
import UnsavedChangesDialog from '../components/common/UnsavedChangesDialog';
import { validateStep } from '../utils/validation';
import dayjs from 'dayjs';

const StepperFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: submission, isLoading: subLoading, isError: subError } = useSubmission(id);
  const { data: formConfig, isLoading: cfgLoading, isError: cfgError } = useFormConfig();
  const updateMutation = useUpdateSubmission();
  const submitMutation = useSubmitSubmission();

  // Local state
  const [activeStep, setActiveStep] = useState(0);
  const [localAnswers, setLocalAnswers] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [unsavedDialogOpen, setUnsavedDialogOpen] = useState(false);
  const [pendingStepChange, setPendingStepChange] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [submitError, setSubmitError] = useState(null);
  const pendingNavigateAway = useRef(null);

  // Hydrate from server data on load
  useEffect(() => {
    if (submission && formConfig) {
      setActiveStep(
        Math.min(submission.currentStep || 0, formConfig.steps.length - 1)
      );
      const serverAnswers = submission.answers
        ? Object.fromEntries(Object.entries(submission.answers))
        : {};
      setLocalAnswers(serverAnswers);
      setHasUnsaved(false);
    }
  }, [submission?._id, formConfig?.id]);

  // Warn on browser back/reload when unsaved
  useBeforeUnload(
    useCallback(
      (e) => {
        if (hasUnsaved) {
          e.preventDefault();
          e.returnValue = '';
        }
      },
      [hasUnsaved]
    )
  );

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleFieldChange = (name, value) => {
    setLocalAnswers((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setHasUnsaved(true);
  };

  const validateCurrentStep = () => {
    if (!formConfig) return false;
    const step = formConfig.steps[activeStep];
    const { valid, errors } = validateStep(step, localAnswers);
    setFieldErrors(errors);
    return valid;
  };

  const handleSave = async (silent = false) => {
    if (!submission || !formConfig) return false;
    try {
      await updateMutation.mutateAsync({
        id: submission._id,
        currentStep: activeStep,
        answers: localAnswers,
      });
      setHasUnsaved(false);
      if (!silent) showSnackbar('Progress saved');
      return true;
    } catch (err) {
      showSnackbar(err?.response?.data?.error || 'Save failed', 'error');
      return false;
    }
  };

  const handleSaveAndNext = async () => {
    const valid = validateCurrentStep();
    if (!valid) return;
    const saved = await handleSave(true);
    if (saved && activeStep < formConfig.steps.length - 1) {
      setActiveStep((s) => s + 1);
      setFieldErrors({});
    }
  };

  const handleBack = () => {
    if (hasUnsaved) {
      setPendingStepChange(activeStep - 1);
      setUnsavedDialogOpen(true);
    } else {
      setActiveStep((s) => Math.max(s - 1, 0));
      setFieldErrors({});
    }
  };

  const handleStepClick = (index) => {
    if (index === activeStep) return;
    if (hasUnsaved) {
      setPendingStepChange(index);
      setUnsavedDialogOpen(true);
    } else {
      setActiveStep(index);
      setFieldErrors({});
    }
  };

  const handleUnsavedStay = async () => {
    setUnsavedDialogOpen(false);
    await handleSave();
    if (pendingStepChange !== null) {
      setActiveStep(pendingStepChange);
      setFieldErrors({});
      setPendingStepChange(null);
    }
  };

  const handleUnsavedLeave = () => {
    setUnsavedDialogOpen(false);
    setHasUnsaved(false);
    if (pendingStepChange !== null) {
      setActiveStep(pendingStepChange);
      setFieldErrors({});
      setPendingStepChange(null);
    }
  };

  const handleClose = () => {
    if (hasUnsaved) {
      setPendingStepChange(null);
      pendingNavigateAway.current = () => navigate('/');
      setUnsavedDialogOpen(true);
    } else {
      navigate('/');
    }
  };

  const handleUnsavedStayNav = async () => {
    setUnsavedDialogOpen(false);
    await handleSave();
    if (pendingNavigateAway.current) {
      pendingNavigateAway.current();
      pendingNavigateAway.current = null;
    }
  };

  const handleUnsavedLeaveNav = () => {
    setUnsavedDialogOpen(false);
    setHasUnsaved(false);
    if (pendingNavigateAway.current) {
      pendingNavigateAway.current();
      pendingNavigateAway.current = null;
    }
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    // Validate ALL steps
    if (!formConfig) return;
    const allErrors = {};
    for (let i = 0; i < formConfig.steps.length; i++) {
      const { valid, errors } = validateStep(formConfig.steps[i], localAnswers);
      if (!valid) allErrors[i] = errors;
    }
    if (Object.keys(allErrors).length > 0) {
      // Show errors on current step if applicable
      if (allErrors[activeStep]) setFieldErrors(allErrors[activeStep]);
      const firstBadStep = Number(Object.keys(allErrors)[0]);
      setActiveStep(firstBadStep);
      setSubmitError('Please complete all required fields before submitting.');
      return;
    }

    // Save current step first
    await handleSave(true);

    try {
      await submitMutation.mutateAsync(submission._id);
      showSnackbar('Submission completed! 🎉');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      const msg = err?.response?.data?.error || 'Submit failed';
      setSubmitError(msg);
      showSnackbar(msg, 'error');
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  if (subLoading || cfgLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (subError || !submission) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={() => navigate('/')}>Back</Button>
        }>
          Submission not found or could not be loaded.
        </Alert>
      </Box>
    );
  }

  if (cfgError || !formConfig) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={() => navigate('/')}>Back</Button>
        }>
          Form configuration could not be loaded. Please try again later.
        </Alert>
      </Box>
    );
  }

  const isCompleted = submission.status === 'completed';
  const steps = formConfig.steps;
  const isLastStep = activeStep === steps.length - 1;
  const currentStep = steps[activeStep];
  const isSaving = updateMutation.isPending;
  const isSubmitting = submitMutation.isPending;

  const onStay = pendingNavigateAway.current ? handleUnsavedStayNav : handleUnsavedStay;
  const onLeave = pendingNavigateAway.current ? handleUnsavedLeaveNav : handleUnsavedLeave;

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto', px: 2, py: 4 }}>
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {dayjs(submission.createdAt).format('MMM D, YYYY, h:mma')}
            </Typography>
            <Typography variant="subtitle1" fontWeight={600}>
              {formConfig.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {submission.title}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isCompleted && (
              <Chip label="Completed" color="success" size="small" icon={<CheckIcon />} />
            )}
            {hasUnsaved && !isCompleted && (
              <Chip label="Unsaved changes" color="warning" size="small" variant="outlined" />
            )}
            <Tooltip title="Back to list">
              <IconButton size="small" onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Stepper */}
        <Box sx={{ px: 3, pt: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel={false}>
            {steps.map((step, index) => (
              <Step
                key={step.id}
                completed={submission.progress > index || isCompleted}
                sx={{ cursor: isCompleted ? 'default' : 'pointer' }}
                onClick={() => !isCompleted && handleStepClick(index)}
              >
                <StepLabel>{step.title}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Form Body */}
        <Box sx={{ px: 3, py: 2, minHeight: 280 }}>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSubmitError(null)}>
              {submitError}
            </Alert>
          )}

          {isCompleted ? (
            <Alert severity="success" sx={{ mt: 1 }}>
              This submission has been completed. All responses have been saved.
            </Alert>
          ) : (
            <StepForm
              step={currentStep}
              answers={localAnswers}
              errors={fieldErrors}
              onChange={handleFieldChange}
            />
          )}
        </Box>

        <Divider />

        {/* Footer Buttons */}
        {!isCompleted && (
          <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleBack}
              disabled={activeStep === 0 || isSaving || isSubmitting}
            >
              Back
            </Button>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={isSaving ? <CircularProgress size={14} /> : <SaveIcon />}
                onClick={() => handleSave()}
                disabled={isSaving || isSubmitting}
              >
                Save
              </Button>

              {isLastStep ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isSaving || isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={14} color="inherit" /> : null}
                >
                  Submit
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSaveAndNext}
                  disabled={isSaving || isSubmitting}
                >
                  Save and Next
                </Button>
              )}
            </Stack>
          </Box>
        )}

        {isCompleted && (
          <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/')}>
              Back to List
            </Button>
          </Box>
        )}
      </Paper>

      {/* Unsaved Changes Dialog */}
      <UnsavedChangesDialog
        open={unsavedDialogOpen}
        onStay={onStay}
        onLeave={onLeave}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StepperFormPage;
