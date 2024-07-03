// src/models/passkeyModel.js
const pool = require('../config/db');

// Function to save passkey information
const savePasskey = async (userId, credentialId, publicKey, counter) => {
    try {
        await pool.query(
            'INSERT INTO passkeys (user_id, credential_id, public_key, counter) VALUES ($1, $2, $3, $4)',
            [userId, credentialId, publicKey, counter]
        );
    } catch (error) {
        throw new Error('Error saving passkey');
    }
};

module.exports = {
    savePasskey,
};
