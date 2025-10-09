/* migrated from app/Http/Requests/Project/UpdateProjectRequest.php */

export function UpdateProjectRequest(req, res, next) {
  const errors = [];
  const body = req.body;

  // Validate 'name' rules: ['sometimes', 'string', 'max:255']
  if (Object.prototype.hasOwnProperty.call(body, 'name')) {
    const nameValue = body.name;
    if (typeof nameValue !== 'string') {
      errors.push({ field: 'name', message: 'The name must be a string.' });
    } else if (nameValue.length > 255) {
      errors.push({ field: 'name', message: 'The name must not be greater than 255 characters.' });
    }
  }

  // Validate 'description' rules: ['sometimes', 'nullable', 'string']
  if (Object.prototype.hasOwnProperty.call(body, 'description')) {
    const descriptionValue = body.description;
    if (descriptionValue !== null) {
      if (typeof descriptionValue !== 'string') {
        errors.push({ field: 'description', message: 'The description must be a string.' });
      }
    }
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default { UpdateProjectRequest };
