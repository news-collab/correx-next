export function required(field, message) {
  return field.length > 0 ? '' : message;
}

export function length(field, minimum, message) {
  return field.length >= minimum ? '' : message;
}

export function confirmation(field, otherField, message) {
  return field === otherField ? '' : message;
}
