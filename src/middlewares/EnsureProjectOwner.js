/* migrated from app/Http/Middleware/EnsureProjectOwner.php */
export function EnsureProjectOwner(req, res, next) {

// IMPORTANT: You will need to import your Project model here.
// Example for Mongoose/Sequelize:
// import Project from '../models/Project.js'; // Adjust the path to your Project model

// For demonstration purposes, assuming Project has a findById method.
// Replace this placeholder with your actual Project model import and usage.
const Project = {
    async findById(id) {
        // This is a placeholder. In a real application, you would interact
        // with your database (e.g., using Mongoose, Sequelize, or a custom ORM).
        // Example (Mongoose): return await YourMongooseProjectModel.findById(id);
        // Example (Sequelize): return await YourSequelizeProjectModel.findByPk(id);
        console.warn('Using mock Project.findById in EnsureProjectOwner.js. Replace with real model interaction.');
        if (id === 'mockProjectId123') {
            return { _id: 'mockProjectId123', user_id: 'mockUserId456', name: 'Test Project' };
        }
        return null; // Simulate not found
    }
};

export async function EnsureProjectOwner(req, res, next) {
    try {
        const projectId = req.params.project; // Corresponds to $request->route('project')

        if (!projectId) {
            // If the 'project' route parameter is missing, it's a bad request.
            return res.status(400).json({ error: 'Project ID is missing from route parameters.' });
        }

        // Find the project by its ID
        // Corresponds to Project::findOrFail($projectId)
        const project = await Project.findById(projectId);

        if (!project) {
            // If the project is not found, return a 404 Not Found response.
            return res.status(404).json({ error: 'Project not found.' });
        }

        // Check if the authenticated user is the owner of the project.
        // We assume `req.user` is populated by a preceding authentication middleware
        // and `req.user.id` contains the ID of the authenticated user.
        // We also assume `project.user_id` is an ID (string or number) that can be compared.
        // Corresponds to if ($project->user_id !== $request->user()->id) { abort(403, 'No autorizado.'); }
        if (!req.user || (project.user_id && project.user_id.toString() !== req.user.id.toString())) {
            return res.status(403).json({ error: 'No autorizado.' }); // Unauthorized
        }

        // Attach the found project object to the request for subsequent middleware/route handlers.
        // Corresponds to $request->attributes->set('project', $project);
        req.project = project;

        // Continue to the next middleware or route handler.
        return next(); // Corresponds to return $next($request);
    } catch (error) {
        // Log the error and return a 500 Internal Server Error response
        console.error('Error in EnsureProjectOwner middleware:', error);
        // Depending on your error handling strategy, you might call next(error)
        // to pass it to a centralized error handling middleware.
        return res.status(500).json({ error: 'Internal Server Error.' });
    }
}

}

export default { EnsureProjectOwner };