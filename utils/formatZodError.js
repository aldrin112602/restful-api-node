const formatZodError = (zodError) => {
  const errors = {};
  const formatted = zodError.format();

  for (const field in formatted) {
    if (field === "_errors") continue;

    const fieldErrors = formatted[field]?._errors;
    if (fieldErrors && fieldErrors.length > 0) {
        const error = fieldErrors.join(", ");
      errors[field] = error.toLowerCase().trim() === "required"
        ? `The ${field} field is required`
        : error;
    }
  }

  return errors;
};

export default formatZodError;