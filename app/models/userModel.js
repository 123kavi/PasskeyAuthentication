// src/models/userModel.js
const pool = require('../config/db');

// Function to create a new user
const createUser = async (username, password) => {
    try {
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
            [username, password]
        );
        return result.rows[0].id;
    } catch (error) {
        throw new Error('Error creating user');
    }
};

module.exports = {
    createUser,
};
