/* migrated from app/Http/Requests/Auth/RegisterRequest.php */

export function RegisterRequest(req, res, next) {
  const errors = [];
  const body = req.body;

  // Helper for adding errors
  const addError = (field, message) => {
    errors.push({ field, message });
  };

  // name validation: ['required','string','max:255']
  if (body.name === undefined || body.name === null || body.name === '') {
    addError('name', 'The name field is required.');
  } else {
    if (typeof body.name !== 'string') {
      addError('name', 'The name must be a string.');
    }
    if (body.name.length > 255) {
      addError('name', 'The name must not be greater than 255 characters.');
    }
  }

  // email validation: ['required','email','max:255','unique:users,email']
  if (body.email === undefined || body.email === null || body.email === '') {
    addError('email', 'The email field is required.');
  } else {
    if (typeof body.email !== 'string') {
      addError('email', 'The email must be a string.');
    }
    // Basic email regex (not exhaustive but common for simple validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      addError('email', 'The email must be a valid email address.');
    }
    if (body.email.length > 255) {
      addError('email', 'The email must not be greater than 255 characters.');
    }
    // unique:users,email
    // TODO: Implement unique validation for email against the database.
    // Example: const userExists = await db.collection('users').findOne({ email: body.email });
    // if (userExists) { addError('email', 'The email has already been taken.'); }
  }

  // password validation: ['required','string','min:8','confirmed']
  if (body.password === undefined || body.password === null || body.password === '') {
    addError('password', 'The password field is required.');
  } else {
    if (typeof body.password !== 'string') {
      addError('password', 'The password must be a string.');
    }
    if (body.password.length < 8) {
      addError('password', 'The password must be at least 8 characters.');
    }
    // 'confirmed' rule checks against 'password_confirmation'
    if (body.password !== body.password_confirmation) {
      addError('password', 'The password confirmation does not match.');
      // It's common to add an error to password_confirmation field too
      // if (body.password_confirmation === undefined || body.password_confirmation === null || body.password_confirmation === '') {
      //   addError('password_confirmation', 'The password confirmation field is required.');
      // } else {
      //   addError('password_confirmation', 'The password confirmation does not match.');
      // }
    }
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default { RegisterRequest };
