/* migrated from app/Http/Requests/Auth/LoginRequest.php */

// Basic email regex (not fully RFC-compliant but common for simple checks)
const emailRegex = /^[^\s@]+@[^\s@]+\\.[^\s@]+$/;

export function LoginRequest(req, res, next) {
  const errors = [];

  // Validate 'email'
  const email = req.body.email;
  if (typeof email === 'undefined' || email === null || email === '') {
    errors.push({ field: 'email', message: 'The email field is required.' });
  } else if (!emailRegex.test(email)) {
    errors.push({ field: 'email', message: 'The email must be a valid email address.' });
  }

  // Validate 'password'
  const password = req.body.password;
  if (typeof password === 'undefined' || password === null || password === '') {
    errors.push({ field: 'password', message: 'The password field is required.' });
  } else if (typeof password !== 'string') {
    errors.push({ field: 'password', message: 'The password must be a string.' });
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }

  next();
}

export default { LoginRequest };
