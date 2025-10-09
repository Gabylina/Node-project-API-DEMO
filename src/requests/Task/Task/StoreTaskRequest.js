/* migrated from app/Http/Requests/Task/StoreTaskRequest.php */

export function StoreTaskRequest(req, res, next) {
  const errors = [];
  const data = req.body; // Assuming the request data is in req.body for POST/PUT requests

  // Validate 'title'
  // Rules: ['required','string','max:255']
  if (data.title === undefined || data.title === null) {
    errors.push({ field: 'title', message: 'The title field is required.' });
  } else if (typeof data.title !== 'string') {
    errors.push({ field: 'title', message: 'The title field must be a string.' });
  } else {
    // It's a non-null string
    if (data.title.trim() === '') {
      errors.push({ field: 'title', message: 'The title field is required.' });
    }
    if (data.title.length > 255) {
      errors.push({ field: 'title', message: 'The title field must not be greater than 255 characters.' });
    }
  }

  // Validate 'description'
  // Rules: ['nullable','string']
  if (data.description !== undefined && data.description !== null) {
    if (typeof data.description !== 'string') {
      errors.push({ field: 'description', message: 'The description field must be a string.' });
    }
  }

  // Validate 'assigned_to'
  // Rules: ['nullable','exists:users,id']
  if (data.assigned_to !== undefined && data.assigned_to !== null) {
    // TODO: Implement 'exists:users,id' validation.
    // This typically involves a database query to check if the value of 'assigned_to'
    // exists in the 'id' column of the 'users' table. Since this requires external
    // dependencies (e.g., a database client), it's marked as a placeholder.
    // Example: const userExists = await db.table('users').where('id', data.assigned_to).first();
    // if (!userExists) { errors.push({ field: 'assigned_to', message: 'The selected assigned to is invalid.' }); }
    // For now, if 'assigned_to' is provided and not null, it will pass this specific rule check.
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default { StoreTaskRequest };
