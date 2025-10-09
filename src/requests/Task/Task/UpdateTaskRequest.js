/* migrated from app/Http/Requests/Task/UpdateTaskRequest.php */

// Emulate TaskStatus enum values from App\Enums\TaskStatus
// Assuming TaskStatus has string values like 'pending', 'in_progress', 'done'.
// If TaskStatus uses numeric values (0, 1, 2), this array should contain those numbers.
// Based on typical Laravel enum usage for status, string values are common.
const TaskStatusValues = ['pending','in_progress','done'];

/**
 * Express middleware for validating update task requests.
 * Corresponds to App\Http\Requests\Task\UpdateTaskRequest.
 */
export function UpdateTaskRequest(req, res, next) {
  const errors = [];
  const data = req.body; // Assuming request body contains the fields to be validated

  // Validation for 'title'
  // Rules: ['sometimes', 'string', 'max:255']
  if (Object.prototype.hasOwnProperty.call(data, 'title')) {
    const value = data.title;
    if (typeof value !== 'string') {
      errors.push({ field: 'title', message: 'The title must be a string.' });
    } else if (value.length > 255) {
      errors.push({ field: 'title', message: 'The title must not be greater than 255 characters.' });
    }
  }

  // Validation for 'description'
  // Rules: ['sometimes', 'nullable', 'string']
  if (Object.prototype.hasOwnProperty.call(data, 'description')) {
    const value = data.description;
    if (value === null) {
      // 'nullable' rule satisfied
    } else if (typeof value !== 'string') {
      errors.push({ field: 'description', message: 'The description must be a string or null.' });
    }
  }

  // Validation for 'status'
  // Rules: ['sometimes', 'in:value1,value2,...']
  if (Object.prototype.hasOwnProperty.call(data, 'status')) {
    const value = data.status;
    if (!TaskStatusValues.includes(value)) {
      errors.push({ field: 'status', message: `The selected status is invalid. Valid options are: ${TaskStatusValues.join(', ')}.` });
    }
  }

  // Validation for 'assigned_to'
  // Rules: ['sometimes', 'nullable', 'exists:users,id']
  if (Object.prototype.hasOwnProperty.call(data, 'assigned_to')) {
    const value = data.assigned_to;
    if (value === null) {
      // 'nullable' rule satisfied
    } else {
      // Basic type validation for ID, assuming it should be a number (integer) or a numeric string.
      // This does NOT replace the 'exists' rule's database check.
      if (typeof value !== 'number' && (typeof value !== 'string' || !/^\d+$/.test(value))) {
        errors.push({ field: 'assigned_to', message: 'The assigned to ID must be an integer or null.' });
      }
      // TODO: Implement actual 'exists:users,id' check. This typically involves querying a database.
      // Example:
      // const userExists = await someUserService.userExists(value);
      // if (!userExists) {
      //   errors.push({ field: 'assigned_to', message: 'The selected assigned to user does not exist.' });
      // }
      errors.push({ field: 'assigned_to', message: 'TODO: Validate if assigned_to user exists in the database.' });
    }
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default { UpdateTaskRequest };