/* migrated from app/Http/Middleware/EnsureProjectOwner.php */
export function EnsureProjectOwner(req, res, next) {

// --- IMPORTANT: Placeholder for your Project model/service --- //
// You will need to replace this mock with your actual data access logic.
// For example, using Mongoose, Sequelize, Prisma, or a custom service.
class ProjectService {
    static async findById(id) {
        // This is a mock implementation. In a real application,
        // this would query your database for a project by its ID.
        // If not found, it should return null or undefined.
        const projects = [
            { id: 1, name: 'Project Alpha', user_id: 101 },
            { id: 2, name: 'Project Beta', user_id: 102 },
            { id: 3, name: 'Project Gamma', user_id: 101 },
        ];
        return projects.find(p => p.id === parseInt(id, 10)) || null;
    }
}
// --- End of Placeholder --- //

export async function EnsureProjectOwner(req, res, next) {
    try {
        // In Laravel: $request->route('project');
        // In Express: req.params.project (assuming the route is defined like /projects/:project)
        const projectId = req.params.project;

        if (!projectId) {
            // If the route parameter 'project' is missing, it's a bad request.
            // This usually means the route definition is incorrect or the URL doesn't match.
            return res.status(400).json({ error: 'Project ID is missing from route parameters.' });
        }

        // Find the project. Laravel's findOrFail() throws 404 if not found.
        const project = await ProjectService.findById(projectId);

        if (!project) {
            return res.status(404).json({ error: 'Project not found.' });
        }

        // Assume req.user is set by a previous authentication middleware
        // (e.g., JWT verification, session middleware).
        // req.user should contain the authenticated user's ID.
        // In Laravel: $request->user()->id
        if (!req.user || !req.user.id) {
            // This implies an authentication middleware failed or is missing.
            return res.status(401).json({ error: 'Unauthenticated.' });
        }

        // Check if the authenticated user is the owner of the project.
        // In Laravel: $project->user_id !== $request->user()->id
        if (project.user_id !== req.user.id) {
            // Laravel's abort(403, 'No autorizado.')
            return res.status(403).json({ error: 'No autorizado.' });
        }

        // Attach the project object to the request for subsequent middleware/route handlers
        // In Laravel: $request->attributes->set('project', $project);
        req.project = project;

        // Proceed to the next middleware or route handler
        return next();
    } catch (error) {
        console.error('Error in EnsureProjectOwner middleware:', error);
        // Generic error response for unexpected issues during database lookup or other operations
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

}

export default { EnsureProjectOwner };