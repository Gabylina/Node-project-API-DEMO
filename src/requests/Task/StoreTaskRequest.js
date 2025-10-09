/* migrated from app/Http/Requests/Task/StoreTaskRequest.php */

export function StoreTaskRequest(req, res, next) {
  const errors = [];
  const body = req.body;

  // Helper function to add errors
  const addError = (field, message) => {
    errors.push({ field, message });
  };

  // --- Validate 'title' ---
  const title = body.title;
  if (title === undefined || title === null || title === '') {
    addError('title', 'The title field is required.');
  } else if (typeof title !== 'string') {
    addError('title', 'The title field must be a string.');
  } else if (title.length > 255) {
    addError('title', 'The title field must not be greater than 255 characters.');
  }

  // --- Validate 'description' ---
  const description = body.description;
  // 'nullable' means if it's undefined or null, it's valid. Otherwise, it must be a string.
  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      addError('description', 'The description field must be a string.');
    }
  }

  // --- Validate 'assigned_to' ---
  const assignedTo = body.assigned_to;
  // 'nullable' means if it's undefined or null, it's valid.
  // If it is provided (not undefined and not null), then we need to apply 'exists' check.
  if (assignedTo !== undefined && assignedTo !== null) {
    // TODO: Implement actual 'exists:users,id' database check.
    // This typically requires a database connection and query, which is outside
    // the scope of a simple, no-dependency middleware. For now, mark it.
    addError('assigned_to', 'The selected assigned to value is invalid. (TODO: Implement database exists check)');
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default {
  StoreTaskRequest
};
