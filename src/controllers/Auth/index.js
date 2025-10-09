const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], sessions: {}, seq: { user: 1, project: 1, task: 1 } });
const users = MEM.users;

const hashPassword = p => `${p}_hashed`;
const comparePassword = (plain, stored) => hashPassword(plain) === stored;

const generateAuthToken = (userId, email) => {
    const token = `mock_token_for_${email.toLowerCase()}`;
    MEM.sessions[token] = userId;
    return token;
};

const getAuthToken = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    const xAccessToken = req.headers['x-access-token'];
    if (xAccessToken) {
        return xAccessToken;
    }
    if (req.query.token) {
        return req.query.token;
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
        if (users.some(u => u.email === lowerEmail)) {
            return res.status(409).json({ message: 'El email ya está registrado.' });
        }

        const newUser = {
            id: MEM.seq.user++,
            name,
            email: lowerEmail,
            password: hashPassword(password),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        users.push(newUser);

        const token = generateAuthToken(newUser.id, newUser.email);

        return res.status(201).json({
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            },
            token
        });
    } catch (e) {
        next(e);
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

        if (!user || !comparePassword(password, user.password)) {
            return res.status(422).json({ message: 'Credenciales inválidas.' });
        }

        const token = generateAuthToken(user.id, user.email);

        return res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        });
    } catch (e) {
        next(e);
    }
}

export async function me(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado.' });
        }

        const userInMem = users.find(u => u.id === req.user.id);

        if (!userInMem) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        return res.status(200).json({
            user: {
                id: userInMem.id,
                name: userInMem.name,
                email: userInMem.email
            }
        });
    } catch (e) {
        next(e);
    }
}

export async function logout(req, res, next) {
    try {
        const token = getAuthToken(req);

        if (!token) {
            return res.status(400).json({ message: 'Token de autorización no proporcionado.' });
        }

        if (MEM.sessions[token]) {
            delete MEM.sessions[token];
            return res.status(200).json({ message: 'Sesión cerrada.' });
        } else {
            return res.status(400).json({ message: 'Token de autorización inválido.' });
        }
    } catch (e) {
        next(e);
    }
}

export const __users = MEM.users;

export default {
    register,
    login,
    me,
    logout,
};
