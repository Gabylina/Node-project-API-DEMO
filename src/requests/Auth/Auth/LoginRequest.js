/* migrated from app/Http/Requests/Auth/LoginRequest.php */

export function LoginRequest(req, res, next) {
  const errors = [];

  const { email, password } = req.body;

  // Validate 'email' field
  if (email === undefined || email === null || email === '') {
    errors.push({ field: 'email', message: 'The email field is required.' });
  } else if (typeof email !== 'string') {
    // Laravel's 'email' rule also implies string type, but explicit check is good.
    errors.push({ field: 'email', message: 'The email must be a string.' });
  } else if (!/^[^\s@]+@[^\s@]+\\.[^\s@]+$/.test(email)) {
    // Basic email format validation
    errors.push({ field: 'email', message: 'The email must be a valid email address.' });
  }

  // Validate 'password' field
  if (password === undefined || password === null || password === '') {
    errors.push({ field: 'password', message: 'The password field is required.' });
  } else if (typeof password !== 'string') {
    errors.push({ field: 'password', message: 'The password must be a string.' });
  }

  // If any errors, return 422 Unprocessable Entity
  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  // If all validations pass, proceed to the next middleware/route handler
  next();
}

export default { LoginRequest };
  LoginRequest,
};
