const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], sessions: {}, seq: { user: 1, project: 1, task: 1 } });

const projects = MEM.projects;
const tasks = MEM.tasks;

// Helper for parameter extraction
const getNumericParam = (req, ...keys) => {
  for (const key of keys) {
    if (req.params?.[key] !== undefined) {
      const val = Number(req.params[key]);
      if (!isNaN(val)) return val;
    }
  }
  return NaN;
};

export async function index(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    const userProjects = projects.filter(p => p.userId === req.user.id);
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
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'El nombre del proyecto es requerido.' });
    }

    const newProject = {
      id: MEM.seq.project++,
      userId: req.user.id,
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
    const projectId = getNumericParam(req, 'project', 'projectId', 'id');
    if (isNaN(projectId)) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado.' });
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
    const projectId = getNumericParam(req, 'project', 'projectId', 'id');
    if (isNaN(projectId)) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado.' });
    }

    const { name, description } = req.body;
    let hasChanges = false;

    if (name !== undefined && name !== project.name) {
      project.name = name;
      hasChanges = true;
    }
    if (description !== undefined && description !== project.description) {
      project.description = description;
      hasChanges = true;
    }

    if (hasChanges) {
      project.updatedAt = new Date().toISOString();
    }

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
    const projectId = getNumericParam(req, 'project', 'projectId', 'id');
    if (isNaN(projectId)) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }

    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    const project = projects[projectIndex];
    if (project.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado.' });
    }

    projects.splice(projectIndex, 1);

    // Cascade delete associated tasks
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

const projectController = {
  index,
  store,
  show,
  update,
  destroy
};

export default projectController;

export const __projects = MEM.projects;
export const __tasks = MEM.tasks;
