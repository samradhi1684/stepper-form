import React from 'react';
import { Box, Stack, Typography, Alert } from '@mui/material';
import FormField from './FormField';

const StepForm = ({ step, answers, errors, onChange, configError }) => {
  if (configError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        This form step has a broken configuration and cannot be rendered.
      </Alert>
    );
  }

  if (!step || !Array.isArray(step.fields) || step.fields.length === 0) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        No fields configured for this step.
      </Alert>
    );
  }

  return (
    <Box sx={{ py: 1 }}>
      <Stack spacing={2.5}>
        {step.fields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={answers[field.name] ?? ''}
            onChange={onChange}
            error={errors[field.name]}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default StepForm;
