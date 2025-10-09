/* migrated from app/Http/Requests/Task/UpdateTaskRequest.php */

// NOTE: TASK_STATUS_VALUES assumes the 'value' property of App\Enums\TaskStatus cases
// as defined in the Laravel application (e.g., 'pending', 'in_progress', 'done').
const TASK_STATUS_VALUES = ['pending','in_progress','done'];

export function UpdateTaskRequest(req, res, next) {
  const errors = [];
  const body = req.body;

  // Rule: 'title' => ['sometimes','string','max:255']
  if (Object.prototype.hasOwnProperty.call(body, 'title')) {
    const value = body.title;
    if (typeof value !== 'string') {
      errors.push({ field: 'title', message: 'The title must be a string.' });
    } else if (value.length > 255) {
      errors.push({ field: 'title', message: 'The title must not be greater than 255 characters.' });
    }
  }

  // Rule: 'description' => ['sometimes','nullable','string']
  if (Object.prototype.hasOwnProperty.call(body, 'description')) {
    const value = body.description;
    if (value !== null && typeof value !== 'string') {
      errors.push({ field: 'description', message: 'The description must be a string or null.' });
    }
  }

  // Rule: 'status' => ['sometimes','in:'.implode(',', array_column(TaskStatus::cases(), 'value'))]
  if (Object.prototype.hasOwnProperty.call(body, 'status')) {
    const value = body.status;
    if (!TASK_STATUS_VALUES.includes(value)) {
      errors.push({ field: 'status', message: `The selected status is invalid. Valid options are: ${TASK_STATUS_VALUES.join(', ')}.` });
    }
  }

  // Rule: 'assigned_to' => ['sometimes','nullable','exists:users,id']
  if (Object.prototype.hasOwnProperty.call(body, 'assigned_to')) {
    const value = body.assigned_to;
    if (value !== null) {
      // TODO: Implement database check for 'exists:users,id'.
      // This typically requires an asynchronous operation and database connection,
      // which is beyond the scope of a simple synchronous middleware without external dependencies.
      // A basic type check is included as a placeholder for validation without DB access.
      if (typeof value !== 'number' || !Number.isInteger(value)) {
        errors.push({ field: 'assigned_to', message: 'The assigned to ID must be an integer or null.' });
      }
    }
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default { UpdateTaskRequest };
