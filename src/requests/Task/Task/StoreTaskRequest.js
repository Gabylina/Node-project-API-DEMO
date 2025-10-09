/* migrated from app/Http/Requests/Task/StoreTaskRequest.php */

export function StoreTaskRequest(req, res, next) {
  const errors = [];

  // Get data from request body
  const { title, description, assigned_to } = req.body;

  // --- Validation for 'title' ---
  // required
  if (title === undefined || title === null || (typeof title === 'string' && title.trim() === '')) {
    errors.push({ field: 'title', message: 'The title field is required.' });
  } else {
    // string
    if (typeof title !== 'string') {
      errors.push({ field: 'title', message: 'The title must be a string.' });
    }
    // max:255
    if (typeof title === 'string' && title.length > 255) {
      errors.push({ field: 'title', message: 'The title must not be greater than 255 characters.' });
    }
  }

  // --- Validation for 'description' ---
  // nullable
  // If description is provided (not undefined, null, or empty string), then validate further
  if (description !== undefined && description !== null && description !== '') {
    // string
    if (typeof description !== 'string') {
      errors.push({ field: 'description', message: 'The description must be a string.' });
    }
  }

  // --- Validation for 'assigned_to' ---
  // nullable
  // If assigned_to is provided (not undefined, null, or empty string), then validate further
  if (assigned_to !== undefined && assigned_to !== null && assigned_to !== '') {
    const value = typeof assigned_to === 'string' ? assigned_to.trim() : assigned_to;

    // Check if it's a valid integer or integer-like string
    if (typeof value === 'string' && !/^\d+$/.test(value)) {
      errors.push({ field: 'assigned_to', message: 'The assigned to field must be an integer.' });
    } else if (typeof value === 'number' && !Number.isInteger(value)) {
      errors.push({ field: 'assigned_to', message: 'The assigned to field must be an integer.' });
    } else if (typeof value !== 'string' && typeof value !== 'number') {
      errors.push({ field: 'assigned_to', message: 'The assigned to field must be an integer.' });
    }
    // exists:users,id - This rule needs database interaction.
    // TODO: Implement validation for 'exists:users,id' - Check if assigned_to exists in the users table.
  }


  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }

  next();
}

export default { StoreTaskRequest };