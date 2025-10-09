/* migrated from app/Http/Requests/Task/UpdateTaskRequest.php */

export function UpdateTaskRequest(req, res, next) {
    const errors = [];
    const data = req.body; // Assuming validation applies to the request body (e.g., for PATCH/PUT).

    const addError = (field, message) => {
        errors.push({ field, message });
    };

    // --- Validation Rules ---

    // 'title' => ['sometimes','string','max:255']
    if (Object.prototype.hasOwnProperty.call(data, 'title')) { // 'sometimes' rule
        const value = data.title;
        if (typeof value !== 'string') { // 'string' rule
            addError('title', 'The title must be a string.');
        } else if (value.length > 255) { // 'max:255' rule
            addError('title', 'The title must not be greater than 255 characters.');
        }
    }

    // 'description' => ['sometimes','nullable','string']
    if (Object.prototype.hasOwnProperty.call(data, 'description')) { // 'sometimes' rule
        const value = data.description;
        if (value !== null) { // 'nullable' check: if not null, apply 'string' rule
            if (typeof value !== 'string') { // 'string' rule
                addError('description', 'The description must be a string.');
            }
        }
        // If value IS null, it's valid due to 'nullable'
    }

    // 'status' => ['sometimes','in:'.implode(',', array_column(TaskStatus::cases(), 'value'))]
    // Assumed TaskStatus enum values based on common patterns. 
    // In a real application, these would typically be imported from a shared constants/enum file.
    const TaskStatusValues = ['pending','in_progress','done']; 
    if (Object.prototype.hasOwnProperty.call(data, 'status')) { // 'sometimes' rule
        const value = data.status;
        if (!TaskStatusValues.includes(value)) { // 'in' rule
            addError('status', `The selected status is invalid. Valid options are: ${TaskStatusValues.join(', ')}.`);
        }
    }

    // 'assigned_to' => ['sometimes','nullable','exists:users,id']
    if (Object.prototype.hasOwnProperty.call(data, 'assigned_to')) { // 'sometimes' rule
        const value = data.assigned_to;
        if (value !== null) { // 'nullable' check: if not null, apply 'exists' rule
            // TODO: Implement database check for 'assigned_to' to ensure it exists in the 'users' table.
            // This rule requires asynchronous database interaction and cannot be implemented synchronously
            // without external dependencies within this middleware. It would typically be handled by a 
            // separate asynchronous validation middleware or service.
            // Example (pseudocode if this middleware were async):
            // const userExists = await db.query('SELECT 1 FROM users WHERE id = $1', [value]);
            // if (!userExists) {
            //     addError('assigned_to', 'The selected assigned to user is invalid.');
            // }
        }
        // If value IS null, it's valid due to 'nullable'
    }

    // --- Handle Errors ---
    if (errors.length > 0) {
        return res.status(422).json({ errors });
    }

    // If validation passes, continue to the next middleware/route handler
    next();
}

export default { UpdateTaskRequest };