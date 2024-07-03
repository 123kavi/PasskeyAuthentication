const pool = require('../../config/db');

exports.createUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
            [username, password]
        );
        const userId = result.rows[0].id;
        console.log(`Register successful`, userId);
        return res.json({ id: userId });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Registration failed' });
    }
};

exports.getUserById = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found!' });
        return res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to retrieve user' });
    }
};
