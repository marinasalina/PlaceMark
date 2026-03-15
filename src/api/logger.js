// Add basic validation error logging to request handler
export function validationError(request, h, error) {
  console.log(error.message);
}
