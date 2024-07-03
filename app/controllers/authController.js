const authService = require('../services/authService');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const userId = await authService.register(username, password);
        return res.json({ id: userId });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Registration failed' });
    }
};

exports.registerChallenge = async (req, res) => {
    const { userId } = req.body;
    try {
        const challengePayload = await authService.generateRegistrationChallenge(userId);
        return res.json({ options: challengePayload });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to generate challenge' });
    }
};

exports.verifyRegistration = async (req, res) => {
    const { userId, cred } = req.body;
    try {
        const verified = await authService.verifyRegistration(userId, cred);
        return res.json({ verified });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Verification failed' });
    }
};

exports.loginChallenge = async (req, res) => {
    const { username } = req.body;
    try {
        const opts = await authService.generateLoginChallenge(username);
        return res.json({ options: opts });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to generate login challenge' });
    }
};

exports.verifyLogin = async (req, res) => {
    const { username, cred } = req.body;
    try {
        const success = await authService.verifyLogin(username, cred);
        return res.json({ success, username });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Login verification failed' });
    }
};
