/* migrated from app/Http/Requests/Auth/LoginRequest.php */

export function LoginRequest(req, res, next) {
  const errors = [];

  const { email, password } = req.body;

  // Validate 'email' field
  if (!email || (typeof email === 'string' && email.trim() === '')) {
    errors.push({ field: 'email', message: 'The email field is required.' });
  } else if (typeof email !== 'string') {
    // Although 'email' implies string, explicit type check.
    errors.push({ field: 'email', message: 'The email must be a string.' });
  } else if (!/^[\S]+@[\S]+\.[\S]+$/.test(email)) {
    // Basic email regex for 'email' rule
    errors.push({ field: 'email', message: 'The email must be a valid email address.' });
  }

  // Validate 'password' field
  if (!password || (typeof password === 'string' && password.trim() === '')) {
    errors.push({ field: 'password', message: 'The password field is required.' });
  } else if (typeof password !== 'string') {
    // Type check for 'string' rule
    errors.push({ field: 'password', message: 'The password must be a string.' });
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default { LoginRequest };
