/* migrated from app/Http/Requests/Project/UpdateProjectRequest.php */

export function UpdateProjectRequest(req, res, next) {
  const errors = [];
  const body = req.body;

  // Validate 'name' field
  if (Object.prototype.hasOwnProperty.call(body, 'name')) { // 'sometimes'
    const name = body.name;
    if (typeof name !== 'string') { // 'string'
      errors.push({ field: 'name', message: 'The name must be a string.' });
    } else if (name.length > 255) { // 'max:255'
      errors.push({ field: 'name', message: 'The name must not be greater than 255 characters.' });
    }
  }

  // Validate 'description' field
  if (Object.prototype.hasOwnProperty.call(body, 'description')) { // 'sometimes'
    const description = body.description;
    if (description !== null && typeof description !== 'string') { // 'nullable', 'string'
      errors.push({ field: 'description', message: 'The description must be a string or null.' });
    }
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default { UpdateProjectRequest };
