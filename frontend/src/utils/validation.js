/**
 * Validates answers for a single step's fields.
 * Returns { valid: boolean, errors: { [fieldName]: string } }
 */
export const validateStep = (step, answers) => {
  const errors = {};

  if (!step || !Array.isArray(step.fields)) return { valid: false, errors };

  for (const field of step.fields) {
    const value = answers[field.name];
    const isEmpty =
      value === undefined || value === null || String(value).trim() === '';

    if (field.required && isEmpty) {
      errors[field.name] = `${field.label} is required`;
      continue;
    }

    if (!isEmpty && (field.type === 'select' || field.type === 'radio')) {
      if (Array.isArray(field.options) && !field.options.includes(value)) {
        errors[field.name] = `${field.label} has an invalid value`;
      }
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

/**
 * Counts how many steps are fully valid given answers.
 */
export const countCompletedSteps = (steps, answers) => {
  if (!Array.isArray(steps)) return 0;
  return steps.filter((step) => validateStep(step, answers).valid).length;
};
