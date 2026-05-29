/**
 * Validates answers for a given step's fields.
 * Returns an object: { valid: boolean, errors: { [fieldName]: string } }
 */
const validateStepAnswers = (step, answers) => {
  const errors = {};

  if (!step || !Array.isArray(step.fields)) {
    return { valid: false, errors: { _config: 'Invalid step configuration' } };
  }

  for (const field of step.fields) {
    const value = answers[field.name];
    const isEmpty =
      value === undefined || value === null || String(value).trim() === '';

    if (field.required && isEmpty) {
      errors[field.name] = `${field.label} is required`;
      continue;
    }

    if (!isEmpty) {
      // Validate select/radio against allowed options
      if (
        (field.type === 'select' || field.type === 'radio') &&
        Array.isArray(field.options) &&
        field.options.length > 0
      ) {
        if (!field.options.includes(value)) {
          errors[field.name] = `${field.label} has an invalid value`;
        }
      }
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

/**
 * Validates that a form config has the expected structure.
 */
const validateFormConfig = (config) => {
  if (!config || !Array.isArray(config.steps) || config.steps.length === 0) {
    return false;
  }
  for (const step of config.steps) {
    if (!step.id || !step.title || !Array.isArray(step.fields)) return false;
    for (const field of step.fields) {
      if (!field.name || !field.label || !field.type) return false;
      if (!['text', 'select', 'radio'].includes(field.type)) return false;
    }
  }
  return true;
};

module.exports = { validateStepAnswers, validateFormConfig };
