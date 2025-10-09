/* migrated from app/Http/Requests/Project/StoreProjectRequest.php */

export function StoreProjectRequest(req, res, next) {
  const errors = [];
  const body = req.body;

  // Validate 'name'
  if (!body.name) {
    errors.push({ field: 'name', message: 'The name field is required.' });
  } else {
    if (typeof body.name !== 'string') {
      errors.push({ field: 'name', message: 'The name must be a string.' });
    }
    if (typeof body.name === 'string' && body.name.length > 255) {
      errors.push({ field: 'name', message: 'The name must not be greater than 255 characters.' });
    }
  }

  // Validate 'description'
  // 'nullable' means it can be absent or explicitly null. If present and not null, it must be a string.
  if (Object.prototype.hasOwnProperty.call(body, 'description') && body.description !== null) {
    if (typeof body.description !== 'string') {
      errors.push({ field: 'description', message: 'The description must be a string.' });
    }
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default {
  StoreProjectRequest
};
