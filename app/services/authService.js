const pool = require('../../config/db');
const {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} = require('@simplewebauthn/server');
const { toHexString, fromHexString } = require('../utils/cryptoUtils');

exports.register = async (username, password) => {
    const result = await pool.query(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
        [username, password]
    );
    return result.rows[0].id;
};

exports.generateRegistrationChallenge = async (userId) => {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) throw new Error('User not found!');

    const user = userResult.rows[0];
    const challengePayload = await generateRegistrationOptions({
        rpID: 'localhost',
        rpName: 'My Localhost Machine',
        attestationType: 'none',
        userName: user.username,
        timeout: 30_000,
    });

    await pool.query('UPDATE users SET challenge = $1 WHERE id = $2', [challengePayload.challenge, userId]);
    return challengePayload;
};

exports.verifyRegistration = async (userId, cred) => {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) throw new Error('User not found!');

    const user = userResult.rows[0];
    const challenge = user.challenge;
    const verificationResult = await verifyRegistrationResponse({
        expectedChallenge: challenge,
        expectedOrigin: 'http://localhost:3000',
        expectedRPID: 'localhost',
        response: cred,
    });

    if (!verificationResult.verified) throw new Error('Could not verify');

    const { credentialID, credentialPublicKey, counter } = verificationResult.registrationInfo;
    if (!credentialID || !credentialPublicKey || counter === undefined) {
        throw new Error('Missing registration information');
    }

    const publicKeyHex = toHexString(credentialPublicKey);
    await pool.query(
        'INSERT INTO passkeys (user_id, credential_id, public_key, counter) VALUES ($1, $2, $3, $4)',
        [userId, credentialID, publicKeyHex, counter]
    );

    return true;
};

exports.generateLoginChallenge = async (username) => {
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) throw new Error('User not found!');

    const user = userResult.rows[0];
    const opts = await generateAuthenticationOptions({ rpID: 'localhost' });
    await pool.query('UPDATE users SET challenge = $1 WHERE username = $2', [opts.challenge, username]);

    return opts;
};

exports.verifyLogin = async (username, cred) => {
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) throw new Error('User not found!');

    const user = userResult.rows[0];
    const challenge = user.challenge;
    const passkeyResult = await pool.query('SELECT * FROM passkeys WHERE user_id = $1', [user.id]);
    if (passkeyResult.rows.length === 0) throw new Error('Passkey not found!');

    const passkey = passkeyResult.rows[0];
    const publicKeyUint8Array = fromHexString(passkey.public_key);

    const result = await verifyAuthenticationResponse({
        expectedChallenge: challenge,
        expectedOrigin: 'http://localhost:3000',
        expectedRPID: 'localhost',
        response: cred,
        authenticator: {
            credentialID: passkey.credential_id,
            credentialPublicKey: publicKeyUint8Array,
            counter: passkey.counter,
        },
    });

    if (!result.verified) throw new Error('Something went wrong');

    await pool.query('UPDATE passkeys SET counter = $1 WHERE id = $2', [result.authenticationInfo.newCounter, passkey.id]);
    return true;
};
