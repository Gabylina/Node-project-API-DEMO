const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], sessions: {}, seq: { user: 1, project: 1, task: 1 } });

const users = MEM.users;

const hash = p => `${p}_hashed`;
const compareHash = (plain, stored) => hash(plain) === stored;

const generateRandomToken = () => {
    const randomPart1 = Math.random().toString(36).substring(2, 18);
    const randomPart2 = Math.random().toString(36).substring(2, 18);
    return `mtok.${randomPart1}${randomPart2}`;
};

const extractToken = (req) => {
    let token = req.headers?.authorization;
    if (token && token.startsWith('Bearer ')) {
        return token.substring(7);
    }
    token = req.headers?.['x-access-token'];
    if (token) {
        return token;
    }
    token = req.query?.token;
    if (token) {
        return token;
    }
    return null;
};

export async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos.' });
        }

        const lowerEmail = email.toLowerCase();

        const existingUser = users.find(u => u.email === lowerEmail);
        if (existingUser) {
            return res.status(409).json({ message: 'El email ya está registrado.' });
        }

        const newUser = {
            id: MEM.seq.user++,
            name,
            email: lowerEmail,
            password: hash(password),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        users.push(newUser);

        const token = generateRandomToken();
        MEM.sessions[token] = newUser.id;

        const userResponse = { id: newUser.id, name: newUser.name, email: newUser.email };

        return res.status(201).json({ user: userResponse, token });
    } catch (e) {
        return next(e);
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
        }

        const lowerEmail = email.toLowerCase();
        const user = users.find(u => u.email === lowerEmail);

        if (!user || !compareHash(password, user.password)) {
            return res.status(422).json({ message: 'Credenciales inválidas' });
        }

        const token = generateRandomToken();
        MEM.sessions[token] = user.id;

        const userResponse = { id: user.id, name: user.name, email: user.email };

        return res.status(200).json({ user: userResponse, token });
    } catch (e) {
        return next(e);
    }
}

export async function me(req, res, next) {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        const user = users.find(u => u.id === req.user.id);
        if (!user) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        const userResponse = { id: user.id, name: user.name, email: user.email };
        return res.status(200).json({ user: userResponse });
    } catch (e) {
        return next(e);
    }
}

export async function logout(req, res, next) {
    try {
        const token = extractToken(req);

        if (!token) {
            return res.status(400).json({ message: 'Token de autorización no proporcionado.' });
        }

        const userId = MEM.sessions[token];

        if (userId === undefined) {
            return res.status(400).json({ message: 'Token de autorización inválido.' });
        }

        delete MEM.sessions[token];

        return res.status(200).json({ message: 'Sesión cerrada' });
    } catch (e) {
        return next(e);
    }
}

export default {
    register,
    login,
    me,
    logout,
};

export const __users = MEM.users;
