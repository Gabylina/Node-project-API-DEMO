/* migrated from app/Http/Requests/Task/UpdateTaskRequest.php */

export function UpdateTaskRequest(req, res, next) {
    const errors = [];
    const data = req.body; // Assuming validation applies to req.body

    const addError = (field, message) => {
        errors.push({ field, message });
    };

    // Validate 'title'
    if (Object.prototype.hasOwnProperty.call(data, 'title')) { // sometimes
        const value = data.title;
        if (typeof value !== 'string') { // string
            addError('title', 'The title must be a string.');
        } else if (value.length > 255) { // max:255
            addError('title', 'The title must not be greater than 255 characters.');
        }
    }

    // Validate 'description'
    if (Object.prototype.hasOwnProperty.call(data, 'description')) { // sometimes
        const value = data.description;
        if (value !== null && typeof value !== 'string') { // nullable, string
            addError('description', 'The description must be a string or null.');
        }
    }

    // Validate 'status'
    if (Object.prototype.hasOwnProperty.call(data, 'status')) { // sometimes
        const value = data.status;
        // Derived from `implode(',', array_column(TaskStatus::cases(), 'value'))`
        // Assuming common string-backed enum values for TaskStatus
        const allowedStatuses = ['pending','in_progress','done']; 
        if (!allowedStatuses.includes(value)) { // in:...
            addError('status', `The selected status is invalid. Valid statuses are: ${allowedStatuses.join(', ')}.`);
        }
    }

    // Validate 'assigned_to'
    if (Object.prototype.hasOwnProperty.call(data, 'assigned_to')) { // sometimes
        const value = data.assigned_to;
        if (value !== null) { // nullable
            // exists:users,id
            // TODO: Implement existence check for 'users' table, 'id' column.
            // This typically requires a database query. For a simple middleware,
            // this is left as a placeholder.
            // Example: if (!await User.findByPk(value)) { addError('assigned_to', 'The selected assigned to is invalid.'); }
        }
    }

    if (errors.length > 0) {
        return res.status(422).json({ errors });
    }

    next();
}

export default {
    UpdateTaskRequest
};
