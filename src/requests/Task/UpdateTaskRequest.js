/* migrated from app/Http/Requests/Task/UpdateTaskRequest.php */

export function UpdateTaskRequest(req, res, next) {
  const errors = [];
  const data = req.body;

  // Helper to add an error
  const addError = (field, message) => {
    errors.push({ field, message });
  };

  // Helper to check if a value exists (even if null, for 'sometimes' combined with 'nullable')
  const hasValue = (value) => value !== undefined;

  // Validate 'title'
  // Rules: 'sometimes', 'string', 'max:255'
  if (hasValue(data.title)) {
    if (typeof data.title !== 'string') {
      addError('title', 'The title must be a string.');
    } else if (data.title.length > 255) {
      addError('title', 'The title must not be greater than 255 characters.');
    }
  }

  // Validate 'description'
  // Rules: 'sometimes', 'nullable', 'string'
  if (hasValue(data.description)) {
    if (data.description !== null && typeof data.description !== 'string') {
      addError('description', 'The description must be a string or null.');
    }
  }

  // Validate 'status'
  // Rules: 'sometimes', 'in:...' (derived from TaskStatus enum)
  // NOTE: In a real application, TaskStatus enum values should be imported or defined here.
  const allowedTaskStatuses = ['pending','in_progress','done']; // Example values for TaskStatus
  if (hasValue(data.status)) {
    if (!allowedTaskStatuses.includes(data.status)) {
      addError('status', `The selected status is invalid. Valid options are: ${allowedTaskStatuses.join(', ')}.`);
    }
  }

  // Validate 'assigned_to'
  // Rules: 'sometimes', 'nullable', 'exists:users,id'
  if (hasValue(data.assigned_to)) {
    if (data.assigned_to !== null) {
      // TODO: Implement database 'exists' validation for users.id.
      // This typically involves querying your database to check if a record with assigned_to exists in the users table.
      // Example (pseudocode): 
      // const userExists = await db.collection('users').findOne({ id: data.assigned_to });
      // if (!userExists) {
      //   addError('assigned_to', 'The selected assigned_to is invalid.');
      // }
      addError('assigned_to', 'The selected assigned_to is invalid. (Database check pending)'); // Placeholder error
    }
  }

  // If there are validation errors, send 422 Unprocessable Entity
  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  // If validation passes, continue to the next middleware/route handler
  next();
}

export default { UpdateTaskRequest };
