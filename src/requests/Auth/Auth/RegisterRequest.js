/* migrated from app/Http/Requests/Auth/RegisterRequest.php */

export function RegisterRequest(req, res, next) {
    const errors = [];
    const body = req.body;

    // --- Validation for 'name' ---
    // Rule: required, string, max:255
    if (body.name === undefined || body.name === null || (typeof body.name === 'string' && body.name.trim() === '')) {
        errors.push({ field: 'name', message: 'The name field is required.' });
    } else if (typeof body.name !== 'string') {
        errors.push({ field: 'name', message: 'The name must be a string.' });
    } else {
        if (body.name.length > 255) {
            errors.push({ field: 'name', message: 'The name must not be greater than 255 characters.' });
        }
    }

    // --- Validation for 'email' ---
    // Rule: required, email, max:255, unique:users,email
    if (body.email === undefined || body.email === null || (typeof body.email === 'string' && body.email.trim() === '')) {
        errors.push({ field: 'email', message: 'The email field is required.' });
    } else if (typeof body.email !== 'string') {
        errors.push({ field: 'email', message: 'The email must be a string.' });
    } else {
        const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/; // Basic email regex
        if (!emailRegex.test(body.email)) {
            errors.push({ field: 'email', message: 'The email must be a valid email address.' });
        }
        if (body.email.length > 255) {
            errors.push({ field: 'email', message: 'The email must not be greater than 255 characters.' });
        }
        // Rule: unique:users,email
        // TODO: Implement unique validation. This typically requires database interaction
        // and would be implemented asynchronously, likely in a separate step or service.
        // Example: if (await UserModel.exists({ email: body.email })) {
        //   errors.push({ field: 'email', message: 'The email has already been taken.' });
        // }
    }

    // --- Validation for 'password' ---
    // Rule: required, string, min:8, confirmed
    if (body.password === undefined || body.password === null || (typeof body.password === 'string' && body.password.trim() === '')) {
        errors.push({ field: 'password', message: 'The password field is required.' });
    } else if (typeof body.password !== 'string') {
        errors.push({ field: 'password', message: 'The password must be a string.' });
    } else {
        if (body.password.length < 8) {
            errors.push({ field: 'password', message: 'The password must be at least 8 characters.' });
        }
        // Rule: confirmed
        if (body.password !== body.password_confirmation) {
            errors.push({ field: 'password', message: 'The password confirmation does not match.' });
        }
    }

    if (errors.length > 0) {
        return res.status(422).json({ errors });
    }

    next();
}

export default { RegisterRequest };
