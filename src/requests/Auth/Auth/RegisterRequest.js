/* migrated from app/Http/Requests/Auth/RegisterRequest.php */

export function RegisterRequest(req, res, next) {
  const validationErrors = [];
  const data = req.body; // Assuming validation data comes from req.body

  const addError = (field, message) => {
    validationErrors.push({ field, message });
  };

  // --- Validate 'name' ---
  // 'required'
  if (data.name === null || data.name === undefined || data.name === '') {
    addError('name', 'The name field is required.');
  }
  // 'string' (only check if it was 'present' in some form, i.e., not null/undefined)
  else if (typeof data.name !== 'string') {
    addError('name', 'The name must be a string.');
  }
  // 'max:255' (only check if it's a string and not null/undefined/empty string)
  else if (data.name.length > 255) {
    addError('name', 'The name must not be greater than 255 characters.');
  }


  // --- Validate 'email' ---
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // 'required'
  if (data.email === null || data.email === undefined || data.email === '') {
    addError('email', 'The email field is required.');
  }
  // 'string'
  else if (typeof data.email !== 'string') {
    addError('email', 'The email must be a string.');
  }
  else { // Only run subsequent rules if it's a non-empty string
    // 'email'
    if (!emailRegex.test(data.email)) {
      addError('email', 'The email must be a valid email address.');
    }
    // 'max:255'
    if (data.email.length > 255) {
      addError('email', 'The email must not be greater than 255 characters.');
    }
    // 'unique:users,email'
    // TODO: Implement unique validation for email. This typically requires a database query.
    // Example:
    // const existingUser = await db.collection('users').findOne({ email: data.email });
    // if (existingUser) {
    //   addError('email', 'The email has already been taken.');
    // }
  }


  // --- Validate 'password' ---
  // 'required'
  if (data.password === null || data.password === undefined || data.password === '') {
    addError('password', 'The password field is required.');
  }
  // 'string'
  else if (typeof data.password !== 'string') {
    addError('password', 'The password must be a string.');
  }
  else { // Only run subsequent rules if it's a non-empty string
    // 'min:8'
    if (data.password.length < 8) {
      addError('password', 'The password must be at least 8 characters.');
    }
    // 'confirmed'
    // Laravel checks for 'password_confirmation' field.
    if (data.password !== data.password_confirmation) {
      addError('password', 'The password confirmation does not match.');
    }
  }


  // If any validation errors occurred, return 422 Unprocessable Entity
  if (validationErrors.length > 0) {
    return res.status(422).json({ errors: validationErrors });
  }

  // If all validations pass, proceed to the next middleware/route handler
  next();
}

export default { RegisterRequest };
