/* migrated from app/Http/Requests/Auth/RegisterRequest.php */

export function RegisterRequest(req, res, next) {
    const errors = [];
    const body = req.body; // Assuming the data is in the request body

    // Validation for 'name'
    if (!body.name || (typeof body.name === 'string' && body.name.trim() === '')) {
        errors.push({ field: 'name', message: 'The name field is required.' });
    } else if (typeof body.name !== 'string') {
        errors.push({ field: 'name', message: 'The name must be a string.' });
    } else {
        if (body.name.length > 255) {
            errors.push({ field: 'name', message: 'The name must not be greater than 255 characters.' });
        }
    }

    // Validation for 'email'
    const emailRegex = /^[^\s@]+@[^\s@]+\\.[^\s@]+$/;
    if (!body.email || (typeof body.email === 'string' && body.email.trim() === '')) {
        errors.push({ field: 'email', message: 'The email field is required.' });
    } else if (typeof body.email !== 'string') {
        errors.push({ field: 'email', message: 'The email must be a string.' });
    } else {
        if (!emailRegex.test(body.email)) {
            errors.push({ field: 'email', message: 'The email must be a valid email address.' });
        }
        if (body.email.length > 255) {
            errors.push({ field: 'email', message: 'The email must not be greater than 255 characters.' });
        }
        // TODO: Implement unique validation for email (e.g., check against database).
    }

    // Validation for 'password'
    if (!body.password || (typeof body.password === 'string' && body.password.trim() === '')) {
        errors.push({ field: 'password', message: 'The password field is required.' });
    } else if (typeof body.password !== 'string') {
        errors.push({ field: 'password', message: 'The password must be a string.' });
    } else {
        if (body.password.length < 8) {
            errors.push({ field: 'password', message: 'The password must be at least 8 characters.' });
        }
        // 'confirmed' rule checks for a 'password_confirmation' field
        if (!body.password_confirmation || (typeof body.password_confirmation === 'string' && body.password_confirmation.trim() === '')) {
            errors.push({ field: 'password_confirmation', message: 'The password confirmation field is required.' });
        } else if (typeof body.password_confirmation !== 'string') {
            errors.push({ field: 'password_confirmation', message: 'The password confirmation must be a string.' });
        } else if (body.password !== body.password_confirmation) {
            errors.push({ field: 'password', message: 'The password confirmation does not match.' });
        }
    }

    if (errors.length > 0) {
        return res.status(422).json({ errors });
    }

    next();
}

export default { RegisterRequest };