import React from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Box,
} from '@mui/material';

const FormField = ({ field, value, onChange, error }) => {
  const handleChange = (e) => onChange(field.name, e.target.value);

  switch (field.type) {
    case 'text':
      return (
        <TextField
          fullWidth
          label={field.required ? `${field.label} *` : field.label}
          value={value || ''}
          onChange={handleChange}
          error={Boolean(error)}
          helperText={error || ' '}
          size="small"
        />
      );

    case 'select':
      return (
        <FormControl fullWidth size="small" error={Boolean(error)}>
          <InputLabel>{field.required ? `${field.label} *` : field.label}</InputLabel>
          <Select
            value={value || ''}
            label={field.required ? `${field.label} *` : field.label}
            onChange={handleChange}
          >
            {(field.options || []).map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{error || ' '}</FormHelperText>
        </FormControl>
      );

    case 'radio':
      return (
        <FormControl error={Boolean(error)} component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontSize: '0.875rem', mb: 0.5 }}>
            {field.required ? `${field.label} *` : field.label}
          </FormLabel>
          <RadioGroup row value={value || ''} onChange={handleChange}>
            {(field.options || []).map((opt) => (
              <FormControlLabel
                key={opt}
                value={opt}
                control={<Radio size="small" />}
                label={opt}
              />
            ))}
          </RadioGroup>
          <FormHelperText>{error || ' '}</FormHelperText>
        </FormControl>
      );

    default:
      return (
        <Box sx={{ color: 'error.main', fontSize: '0.875rem' }}>
          Unknown field type: {field.type}
        </Box>
      );
  }
};

export default FormField;
