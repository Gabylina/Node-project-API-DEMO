/* migrated from app/Http/Requests/Project/UpdateProjectRequest.php */

export function UpdateProjectRequest(req, res, next) {
    const errors = [];
    const data = req.body; // Assuming the data is in req.body for a PUT/PATCH request

    // Validate 'name'
    if ('name' in data) { // 'sometimes'
        const name = data.name;
        if (typeof name !== 'string') { // 'string'
            errors.push({ field: 'name', message: 'The name must be a string.' });
        } else if (name.length > 255) { // 'max:255'
            errors.push({ field: 'name', message: 'The name must not be greater than 255 characters.' });
        }
    }

    // Validate 'description'
    if ('description' in data) { // 'sometimes'
        const description = data.description;
        if (description !== null) { // 'nullable' allows null, so we only validate if it's not null
            if (typeof description !== 'string') { // 'string'
                errors.push({ field: 'description', message: 'The description must be a string or null.' });
            }
        }
        // If description is null, it's valid due to 'nullable'.
    }

    if (errors.length > 0) {
        return res.status(422).json({ errors });
    }

    next();
}

export default { UpdateProjectRequest };
