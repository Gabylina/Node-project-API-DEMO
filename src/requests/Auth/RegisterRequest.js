/* migrated from app/Http/Requests/Auth/RegisterRequest.php */

export function RegisterRequest(req, res, next) {
    const errors = [];
    const data = req.body || {}; // Ensure data is an object, even if req.body is undefined

    // Helper to add error
    const addError = (field, message) => {
        errors.push({ field, message });
    };

    // --- name --- 
    const name = data.name;
    if (name === undefined || name === null || (typeof name === 'string' && name.trim() === '')) {
        addError('name', 'The name field is required.');
    } else if (typeof name !== 'string') {
        addError('name', 'The name must be a string.');
    } else { // It's a non-empty string
        if (name.length > 255) {
            addError('name', 'The name must not be greater than 255 characters.');
        }
    }

    // --- email --- 
    const email = data.email;
    if (email === undefined || email === null || (typeof email === 'string' && email.trim() === '')) {
        addError('email', 'The email field is required.');
    } else if (typeof email !== 'string') {
        addError('email', 'The email must be a string.');
    } else { // It's a non-empty string
        const emailRegex = /^[^\s@]+@[^\s@]+\\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            addError('email', 'The email must be a valid email address.');
        }
        if (email.length > 255) {
            addError('email', 'The email must not be greater than 255 characters.');
        }
        // TODO: Implement unique validation for email (e.g., database lookup)
        // This would typically involve an async call to a database service.
        // addError('email', 'The email has already been taken.');
    }

    // --- password ---
    const password = data.password;
    const passwordConfirmation = data.password_confirmation;

    if (password === undefined || password === null || (typeof password === 'string' && password.trim() === '')) {
        addError('password', 'The password field is required.');
    } else if (typeof password !== 'string') {
        addError('password', 'The password must be a string.');
    } else { // It's a non-empty string
        if (password.length < 8) {
            addError('password', 'The password must be at least 8 characters.');
        }
        // Laravel's 'confirmed' rule checks against 'field_confirmation'
        if (password !== passwordConfirmation) {
            addError('password', 'The password confirmation does not match.');
        }
    }

    if (errors.length > 0) {
        return res.status(422).json({ errors });
    }

    next();
}

export default { RegisterRequest };
