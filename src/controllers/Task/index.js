const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], sessions: {}, seq: { user: 1, project: 1, task: 1 } });

const users = MEM.users;
const projects = MEM.projects;
const tasks = MEM.tasks;

const normalizeStatus = s => {
    const v = String(s ?? '').toLowerCase().replace(/_/g, '-');
    return ['pending', 'in-progress', 'completed'].includes(v) ? v : 'pending';
};

const getProjectId = (req) => Number(req.params?.project ?? req.params?.projectId ?? req.params?.id);
const getTaskId = (req) => Number(req.params?.task ?? req.params?.taskId ?? req.params?.id);

const checkAuthAndProjectOwner = (req, res, projectId) => {
    if (!req.user) {
        res.status(401).json({ message: 'No autenticado' });
        return false;
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) {
        res.status(404).json({ message: 'Proyecto no encontrado.' });
        return false;
    }

    if (req.user.id !== project.userId) {
        res.status(403).json({ message: 'No autorizado.' });
        return false;
    }
    return project;
};

export async function index(req, res, next) {
    try {
        const projectId = getProjectId(req);
        if (isNaN(projectId)) {
            return res.status(400).json({ message: 'ID de proyecto inválido.' });
        }

        const project = checkAuthAndProjectOwner(req, res, projectId);
        if (!project) return;

        const projectTasks = tasks.filter(task => task.projectId === projectId);
        return res.status(200).json(projectTasks);
    } catch (e) {
        return next(e);
    }
}

export async function store(req, res, next) {
    try {
        const projectId = getProjectId(req);
        if (isNaN(projectId)) {
            return res.status(400).json({ message: 'ID de proyecto inválido.' });
        }

        const project = checkAuthAndProjectOwner(req, res, projectId);
        if (!project) return;

        const { name, description, status } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'El nombre de la tarea es obligatorio.' });
        }

        const now = new Date().toISOString();
        const newTask = {
            id: MEM.seq.task++,
            projectId: projectId,
            userId: req.user.id,
            name,
            description: description ?? null,
            status: normalizeStatus(status ?? 'pending'),
            createdAt: now,
            updatedAt: now,
        };
        tasks.push(newTask);

        return res.status(201).json(newTask);
    } catch (e) {
        return next(e);
    }
}

export async function show(req, res, next) {
    try {
        const projectId = getProjectId(req);
        const taskId = getTaskId(req);

        if (isNaN(projectId)) {
            return res.status(400).json({ message: 'ID de proyecto inválido.' });
        }
        if (isNaN(taskId)) {
            return res.status(400).json({ message: 'ID de tarea inválido.' });
        }

        const project = checkAuthAndProjectOwner(req, res, projectId);
        if (!project) return;

        const task = tasks.find(t => t.id === taskId && t.projectId === projectId);
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada.' });
        }

        return res.status(200).json(task);
    } catch (e) {
        return next(e);
    }
}

export async function update(req, res, next) {
    try {
        const projectId = getProjectId(req);
        const taskId = getTaskId(req);

        if (isNaN(projectId)) {
            return res.status(400).json({ message: 'ID de proyecto inválido.' });
        }
        if (isNaN(taskId)) {
            return res.status(400).json({ message: 'ID de tarea inválido.' });
        }

        const project = checkAuthAndProjectOwner(req, res, projectId);
        if (!project) return;

        const taskIndex = tasks.findIndex(t => t.id === taskId && t.projectId === projectId);
        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Tarea no encontrada.' });
        }

        const task = tasks[taskIndex];
        const { name, description, status } = req.body;

        if (name !== undefined) task.name = name;
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = normalizeStatus(status);

        task.updatedAt = new Date().toISOString();
        tasks[taskIndex] = task;

        return res.status(200).json(task);
    } catch (e) {
        return next(e);
    }
}

export async function destroy(req, res, next) {
    try {
        const projectId = getProjectId(req);
        const taskId = getTaskId(req);

        if (isNaN(projectId)) {
            return res.status(400).json({ message: 'ID de proyecto inválido.' });
        }
        if (isNaN(taskId)) {
            return res.status(400).json({ message: 'ID de tarea inválido.' });
        }

        const project = checkAuthAndProjectOwner(req, res, projectId);
        if (!project) return;

        const taskIndex = tasks.findIndex(t => t.id === taskId && t.projectId === projectId);
        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Tarea no encontrada.' });
        }

        tasks.splice(taskIndex, 1);

        return res.status(204).json({});
    } catch (e) {
        return next(e);
    }
}

export async function changeStatus(req, res, next) {
    try {
        const projectId = getProjectId(req);
        const taskId = getTaskId(req);

        if (isNaN(projectId)) {
            return res.status(400).json({ message: 'ID de proyecto inválido.' });
        }
        if (isNaN(taskId)) {
            return res.status(400).json({ message: 'ID de tarea inválido.' });
        }

        const project = checkAuthAndProjectOwner(req, res, projectId);
        if (!project) return;

        const taskIndex = tasks.findIndex(t => t.id === taskId && t.projectId === projectId);
        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Tarea no encontrada.' });
        }

        const { status } = req.body;
        if (status === undefined) {
            return res.status(400).json({ message: 'El estado es obligatorio.' });
        }

        const task = tasks[taskIndex];
        task.status = normalizeStatus(status);
        task.updatedAt = new Date().toISOString();
        tasks[taskIndex] = task;

        return res.status(200).json(task);
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
    changeStatus,
};

export const __users = MEM.users;
export const __projects = MEM.projects;
export const __tasks = MEM.tasks;