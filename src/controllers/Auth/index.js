const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], sessions: {}, seq: { user: 1, project: 1, task: 1 } });

const users = MEM.users;

// Simple password hashing/comparison (as per requirement, no external libs)
const hash = p => `${p}_hashed`;
const compareHash = (plain, stored) => hash(plain) === stored;

// Helper to generate a random base64url string for tokens
const generateRandomBase64Url = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Helper to extract token from request headers or query params
const extractToken = (req) => {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.headers['x-access-token']) {
        token = req.headers['x-access-token'];
    } else if (req.query.token) {
        token = req.query.token;
    }
    return token;
};

export async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Faltan campos obligatorios: name, email, password.' });
        }

        const normalizedEmail = email.toLowerCase();

        // Check if user already exists
        if (users.some(u => u.email === normalizedEmail)) {
            return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
        }

        const newUser = {
            id: MEM.seq.user++,
            name,
            email: normalizedEmail,
            password: hash(password), // Store hashed password
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        users.push(newUser);

        // Generate token and store session
        const token = "mtok." + generateRandomBase64Url(32);
        MEM.sessions[token] = newUser.id;

        return res.status(201).json({
            user: { id: newUser.id, name: newUser.name, email: newUser.email },
            token
        });

    } catch (e) {
        return next(e);
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Faltan campos obligatorios: email, password.' });
        }

        const normalizedEmail = email.toLowerCase();
        const user = users.find(u => u.email === normalizedEmail);

        if (!user || !compareHash(password, user.password)) {
            return res.status(422).json({ message: 'Credenciales inválidas.' });
        }

        // Generate token and store session
        const token = "mtok." + generateRandomBase64Url(32);
        MEM.sessions[token] = user.id;

        return res.status(200).json({
            user: { id: user.id, name: user.name, email: user.email },
            token
        });

    } catch (e) {
        return next(e);
    }
}

export async function me(req, res, next) {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'No autenticado.' });
        }

        const user = users.find(u => u.id === req.user.id);

        if (!user) { // This case should ideally be handled by an authentication middleware first
            return res.status(401).json({ message: 'Usuario no encontrado.' });
        }

        return res.status(200).json({
            user: { id: user.id, name: user.name, email: user.email }
        });

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

        if (MEM.sessions[token]) {
            delete MEM.sessions[token];
            return res.status(200).json({ message: 'Sesión cerrada.' });
        } else {
            return res.status(400).json({ message: 'Token de autorización inválido.' });
        }

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
