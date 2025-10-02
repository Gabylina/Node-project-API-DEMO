const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], sessions: {}, seq: { user: 1, project: 1, task: 1 } });

const projects = MEM.projects;
const tasks = MEM.tasks;

const getParam = (req, ...keys) => {
    for (const key of keys) {
        if (req.params?.[key] !== undefined) {
            return req.params[key];
        }
    }
    return undefined;
};

export async function index(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }
        const currentUserId = req.user.id;
        const userProjects = projects.filter(p => p.userId === currentUserId);
        return res.status(200).json(userProjects);
    } catch (e) {
        return next(e);
    }
}

export async function store(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }
        const currentUserId = req.user.id;
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'El nombre del proyecto es requerido.' });
        }

        const newProject = {
            id: MEM.seq.project++,
            userId: currentUserId,
            name,
            description: description ?? null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        projects.push(newProject);

        return res.status(201).json(newProject);
    } catch (e) {
        return next(e);
    }
}

export async function show(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }
        const currentUserId = req.user.id;

        const projectId = Number(getParam(req, 'project', 'projectId', 'id'));
        if (isNaN(projectId) || projectId <= 0) {
            return res.status(400).json({ message: 'ID de proyecto inválido.' });
        }

        const project = projects.find(p => p.id === projectId);

        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        if (project.userId !== currentUserId) {
            return res.status(403).json({ message: 'No autorizado para ver este proyecto.' });
        }

        const projectTasks = tasks.filter(t => t.projectId === projectId);
        
        return res.status(200).json({ ...project, tasks: projectTasks });
    } catch (e) {
        return next(e);
    }
}

export async function update(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }
        const currentUserId = req.user.id;

        const projectId = Number(getParam(req, 'project', 'projectId', 'id'));
        if (isNaN(projectId) || projectId <= 0) {
            return res.status(400).json({ message: 'ID de proyecto inválido.' });
        }

        const project = projects.find(p => p.id === projectId);

        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        if (project.userId !== currentUserId) {
            return res.status(403).json({ message: 'No autorizado para actualizar este proyecto.' });
        }

        const { name, description } = req.body;

        if (name !== undefined) project.name = name;
        if (description !== undefined) project.description = description;
        project.updatedAt = new Date().toISOString();

        return res.status(200).json(project);
    } catch (e) {
        return next(e);
    }
}

export async function destroy(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }
        const currentUserId = req.user.id;

        const projectId = Number(getParam(req, 'project', 'projectId', 'id'));
        if (isNaN(projectId) || projectId <= 0) {
            return res.status(400).json({ message: 'ID de proyecto inválido.' });
        }

        const projectIndex = projects.findIndex(p => p.id === projectId);

        if (projectIndex === -1) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        if (projects[projectIndex].userId !== currentUserId) {
            return res.status(403).json({ message: 'No autorizado para eliminar este proyecto.' });
        }

        // Remove project
        projects.splice(projectIndex, 1);

        // Cascade delete tasks associated with this project
        for (let i = tasks.length - 1; i >= 0; i--) {
            if (tasks[i].projectId === projectId) {
                tasks.splice(i, 1);
            }
        }

        return res.status(204).json({});
    } catch (e) {
        return next(e);
    }
}

export default {
    index,
    store,
    show,
    update,
    destroy,
};

export const __projects = MEM.projects;
export const __tasks = MEM.tasks;
