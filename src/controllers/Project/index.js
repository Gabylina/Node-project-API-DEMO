const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], sessions: {}, seq: { user: 1, project: 1, task: 1 } });

const projects = MEM.projects;
const tasks = MEM.tasks;

const getParam = (req, ...keys) => {
    for (const key of keys) {
        if (req?.params?.[key] !== undefined) {
            return req.params[key];
        }
    }
    return undefined;
};

const authorizeOwner = (req, res, project) => {
    if (!req.user) {
        res.status(401).json({ message: 'No autenticado' });
        return false;
    }
    if (project.userId !== req.user.id) {
        res.status(403).json({ message: 'No autorizado' });
        return false;
    }
    return true;
};

export async function index(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }
        const userProjects = projects.filter(p => p.userId === req.user.id);
        return res.status(200).json(userProjects);
    } catch (e) {
        next(e);
    }
}

export async function store(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        const { name, description } = req.body;

        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ message: 'El nombre del proyecto es requerido.' });
        }
        if (description !== undefined && typeof description !== 'string') {
            return res.status(400).json({ message: 'La descripción del proyecto debe ser una cadena de texto.' });
        }

        const now = new Date().toISOString();
        const newProject = {
            id: MEM.seq.project++,
            userId: req.user.id,
            name,
            description: description ?? null,
            createdAt: now,
            updatedAt: now,
        };

        projects.push(newProject);
        return res.status(201).json(newProject);
    } catch (e) {
        next(e);
    }
}

export async function show(req, res, next) {
    try {
        const projectId = Number(getParam(req, 'project', 'projectId', 'id'));

        if (isNaN(projectId) || projectId <= 0) {
            return res.status(400).json({ message: 'ID de proyecto inválido.' });
        }

        const project = projects.find(p => p.id === projectId);

        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        if (!authorizeOwner(req, res, project)) {
            return;
        }

        const projectTasks = tasks.filter(t => t.projectId === projectId);
        return res.status(200).json({ ...project, tasks: projectTasks });
    } catch (e) {
        next(e);
    }
}

export async function update(req, res, next) {
    try {
        const projectId = Number(getParam(req, 'project', 'projectId', 'id'));

        if (isNaN(projectId) || projectId <= 0) {
            return res.status(400).json({ message: 'ID de proyecto inválido.' });
        }

        const projectIndex = projects.findIndex(p => p.id === projectId);

        if (projectIndex === -1) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        const project = projects[projectIndex];

        if (!authorizeOwner(req, res, project)) {
            return;
        }

        const { name, description } = req.body;
        const updates = {};

        if (name !== undefined) {
            if (typeof name !== 'string' || name.trim() === '') {
                return res.status(400).json({ message: 'El nombre del proyecto no puede estar vacío.' });
            }
            updates.name = name;
        }
        if (description !== undefined) {
            if (typeof description !== 'string') {
                return res.status(400).json({ message: 'La descripción del proyecto debe ser una cadena de texto.' });
            }
            updates.description = description; // Allow null to clear it
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron datos para actualizar.' });
        }

        Object.assign(project, updates);
        project.updatedAt = new Date().toISOString();

        return res.status(200).json(project);
    } catch (e) {
        next(e);
    }
}

export async function destroy(req, res, next) {
    try {
        const projectId = Number(getParam(req, 'project', 'projectId', 'id'));

        if (isNaN(projectId) || projectId <= 0) {
            return res.status(400).json({ message: 'ID de proyecto inválido.' });
        }

        const projectIndex = projects.findIndex(p => p.id === projectId);

        if (projectIndex === -1) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        const project = projects[projectIndex];

        if (!authorizeOwner(req, res, project)) {
            return;
        }

        projects.splice(projectIndex, 1);

        for (let i = tasks.length - 1; i >= 0; i--) {
            if (tasks[i].projectId === projectId) {
                tasks.splice(i, 1);
            }
        }

        return res.status(204).json({});
    } catch (e) {
        next(e);
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
