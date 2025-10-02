/* migrated from app/Http/Requests/Task/StoreTaskRequest.php */

export function StoreTaskRequest(req, res, next) {
  const errors = [];
  const body = req.body;

  // Validate 'title'
  if (body.title === undefined || body.title === null || body.title === '') {
    errors.push({ field: 'title', message: 'The title field is required.' });
  } else if (typeof body.title !== 'string') {
    errors.push({ field: 'title', message: 'The title must be a string.' });
  } else if (body.title.length > 255) {
    errors.push({ field: 'title', message: 'The title must not be greater than 255 characters.' });
  }

  // Validate 'description'
  // 'nullable' means it can be undefined or null. If present, it must be a string.
  if (body.description !== undefined && body.description !== null) {
    if (typeof body.description !== 'string') {
      errors.push({ field: 'description', message: 'The description must be a string.' });
    }
  }

  // Validate 'assigned_to'
  // 'nullable' means it can be undefined or null. If present, it must pass further checks.
  if (body.assigned_to !== undefined && body.assigned_to !== null) {
    // For 'exists:users,id', we would typically query the database.
    // For now, if provided, we'll check if it's an integer, as IDs usually are.
    if (!Number.isInteger(body.assigned_to)) {
      errors.push({ field: 'assigned_to', message: 'The assigned_to must be an integer.' });
    }
    // TODO: Implement exists:users,id validation by querying your database.
    // Example: In a real application, you'd perform a database lookup here.
    // const user = await db.collection('users').findOne({ id: body.assigned_to });
    // if (!user) {
    //   errors.push({ field: 'assigned_to', message: 'The selected assigned_to is invalid.' });
    // }
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default { StoreTaskRequest };
