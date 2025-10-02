/* migrated from app/Http/Requests/Project/UpdateProjectRequest.php */

export function UpdateProjectRequest(req, res, next) {
  const errors = [];

  // Validate 'name'
  // 'sometimes' means the field is optional, but if present, it must be valid.
  if (Object.prototype.hasOwnProperty.call(req.body, 'name')) {
    const name = req.body.name;
    if (typeof name !== 'string') {
      errors.push({ field: 'name', message: 'The name must be a string.' });
    } else if (name.length > 255) {
      errors.push({ field: 'name', message: 'The name must not be greater than 255 characters.' });
    }
  }

  // Validate 'description'
  // 'sometimes' means the field is optional, but if present, it must be valid.
  if (Object.prototype.hasOwnProperty.call(req.body, 'description')) {
    const description = req.body.description;
    // 'nullable' allows the field to be null. If not null, then 'string' rule applies.
    if (description !== null) {
      if (typeof description !== 'string') {
        errors.push({ field: 'description', message: 'The description must be a string if not null.' });
      }
    }
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default { UpdateProjectRequest };
  UpdateProjectRequest,
};
