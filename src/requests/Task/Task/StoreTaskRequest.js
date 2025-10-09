/* migrated from app/Http/Requests/Task/StoreTaskRequest.php */

export function StoreTaskRequest(req, res, next) {
    const errors = [];
    const data = req.body; // Assuming JSON body for POST/PUT requests

    // --- Validation for 'title' ---
    const title = data.title;
    if (title === undefined || title === null || title === '') {
        errors.push({ field: 'title', message: 'The title field is required.' });
    } else if (typeof title !== 'string') {
        errors.push({ field: 'title', message: 'The title must be a string.' });
    } else if (title.length > 255) {
        errors.push({ field: 'title', message: 'The title must not be greater than 255 characters.' });
    }

    // --- Validation for 'description' ---
    const description = data.description;
    // 'nullable' means it's optional; only validate if present and not null.
    if (description !== undefined && description !== null && typeof description !== 'string') {
        errors.push({ field: 'description', message: 'The description must be a string.' });
    }

    // --- Validation for 'assigned_to' ---
    const assigned_to = data.assigned_to;
    // 'nullable' means it's optional; only validate if present and not null.
    if (assigned_to !== undefined && assigned_to !== null) {
        // TODO: Implement database 'exists' check for assigned_to (users, id)
        // This rule typically requires an asynchronous database query.
        // For a simple, dependency-free middleware, this logic is deferred.
        // Example (conceptual, requires database access and async handling):
        // try {
        //     const userExists = await db.collection('users').findOne({ id: assigned_to });
        //     if (!userExists) {
        //         errors.push({ field: 'assigned_to', message: 'The selected assigned to is invalid.' });
        //     }
        // } catch (err) {
        //     // Handle database error if necessary
        //     errors.push({ field: 'assigned_to', message: 'A database error occurred during validation.' });
        // }
    }


    if (errors.length > 0) {
        return res.status(422).json({ errors });
    }

    next();
}

export default {
    StoreTaskRequest
};
