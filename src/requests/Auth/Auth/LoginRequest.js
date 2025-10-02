/* migrated from app/Http/Requests/Auth/LoginRequest.php */

export function LoginRequest(req, res, next) {
  const errors = [];
  // Data is typically found in req.body for POST/PUT requests, or req.query/req.params for GET requests.
  // For login, we'll assume req.body.
  const { email, password } = req.body;

  // Validate 'email'
  if (email === undefined || email === null || email === '') {
    errors.push({ field: 'email', message: 'The email field is required.' });
  } else if (typeof email !== 'string') {
    errors.push({ field: 'email', message: 'The email must be a string.' });
  } else {
    // Basic email format validation (can be replaced with a more robust regex or library if needed)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      errors.push({ field: 'email', message: 'The email must be a valid email address.' });
    }
  }

  // Validate 'password'
  if (password === undefined || password === null || password === '') {
    errors.push({ field: 'password', message: 'The password field is required.' });
  } else if (typeof password !== 'string') {
    errors.push({ field: 'password', message: 'The password must be a string.' });
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default { LoginRequest };
