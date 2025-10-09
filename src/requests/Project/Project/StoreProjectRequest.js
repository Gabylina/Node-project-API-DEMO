/* migrated from app/Http/Requests/Project/StoreProjectRequest.php */

export function StoreProjectRequest(req, res, next) {
  const errors = [];
  // Combine potential input sources. Body usually takes precedence.
  const data = { ...req.params, ...req.query, ...req.body };

  // Validate 'name' field
  const name = data.name;

  // Rule: required
  if (name === undefined || name === null || (typeof name === 'string' && name.trim() === '')) {
    errors.push({ field: 'name', message: 'The name field is required.' });
  } else {
    // Rule: string
    if (typeof name !== 'string') {
      errors.push({ field: 'name', message: 'The name must be a string.' });
    } else {
      // Rule: max:255 (only if it's a valid string)
      if (name.length > 255) {
        errors.push({ field: 'name', message: 'The name must not be greater than 255 characters.' });
      }
    }
  }

  // Validate 'description' field
  const description = data.description;

  // Rule: nullable (if description is null or undefined, no other rules apply)
  if (description !== undefined && description !== null) {
    // Rule: string (only if it's not null/undefined)
    if (typeof description !== 'string') {
      errors.push({ field: 'description', message: 'The description must be a string.' });
    }
  }

  // If any errors were found, return a 422 Unprocessable Entity response
  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  // If validation passes, proceed to the next middleware/route handler
  next();
}

export default { StoreProjectRequest };
