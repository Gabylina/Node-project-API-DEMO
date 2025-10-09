/* migrated from app/Http/Requests/Auth/LoginRequest.php */

export function LoginRequest(req, res, next) {
  const errors = [];
  const { email, password } = req.body;

  // Validate 'email' (rules: required, email)
  if (email === undefined || email === null || String(email).trim() === '') {
    errors.push({ field: 'email', message: 'The email field is required.' });
  } else if (typeof email !== 'string') {
    errors.push({ field: 'email', message: 'The email field must be a string.' });
  } else {
    // A simple regex for email validation without external dependencies
    const emailRegex = /^[^\s@]+@[^\s@]+\\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push({ field: 'email', message: 'The email field must be a valid email address.' });
    }
  }

  // Validate 'password' (rules: required, string)
  if (password === undefined || password === null || String(password).trim() === '') {
    errors.push({ field: 'password', message: 'The password field is required.' });
  } else if (typeof password !== 'string') {
    // In an Express context, 'string' typically means the value's type is strictly 'string'.
    // Laravel's 'string' rule can sometimes be more flexible, allowing values that can be implicitly cast to a string (e.g., numbers).
    errors.push({ field: 'password', message: 'The password field must be a string.' });
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default { LoginRequest };
