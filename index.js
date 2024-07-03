const express = require('express');
const path = require('path');
const layouts = require("express-ejs-layouts");

const app = express();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
app.use(express.json());
if (!globalThis.crypto) {
    globalThis.crypto = crypto;
}
// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

//Templates
app.use(layouts);
app.set("views", path.join(__dirname, "public/views"));
app.set("layout", "layouts/application");
app.set("view engine", "ejs");



// Set 'views' directory for any view templates
app.set('views', path.join(__dirname, 'app', 'views'));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.use('/auth', authRoutes);
app.use('/users', userRoutes); 
app.use('/', require('./config/routes'))


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on PORT:${PORT}`);
});


// const express = require('express');
// const crypto = require("node:crypto");
// const { Pool } = require('pg');
// const { 
//     generateRegistrationOptions, 
//     verifyRegistrationResponse, 
//     generateAuthenticationOptions, 
//     verifyAuthenticationResponse 
// } = require('@simplewebauthn/server');

// if (!globalThis.crypto) {
//     globalThis.crypto = crypto;
// }

// const PORT = 3000;
// const app = express();

// app.use(express.static('./public'));
// app.use(express.json());

// // PostgreSQL setup
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'postgres',
//     password: 'root',
//     port: 5432,
//     connectionTimeoutMillis: 30000, // 30 seconds
// });

// // Convert Uint8Array to Hexadecimal String
// function toHexString(byteArray) {
//     return Array.prototype.map.call(byteArray, byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
// }

// // Convert Hexadecimal String to Uint8Array
// function fromHexString(hexString) {
//     return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
// }

// // Routes
// app.post('/register', async (req, res) => {
//     const { username, password } = req.body;
    
//     try {
//         const result = await pool.query(
//             'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id', 
//             [username, password]
//         );
//         const userId = result.rows[0].id;
//         console.log(`Register successful`, userId);

//         return res.json({ id: userId });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ error: 'Registration failed' });
//     }
// });

// app.post('/register-challenge', async (req, res) => {
//     const { userId } = req.body;

//     try {
//         const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
//         if (userResult.rows.length === 0) return res.status(404).json({ error: 'User not found!' });

//         const user = userResult.rows[0];

//         const challengePayload = await generateRegistrationOptions({
//             rpID: 'localhost',
//             rpName: 'My Localhost Machine',
//             attestationType: 'none',
//             userName: user.username,
//             timeout: 30_000,
//         });

//         await pool.query('UPDATE users SET challenge = $1 WHERE id = $2', [challengePayload.challenge, userId]);

//         return res.json({ options: challengePayload });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ error: 'Failed to generate challenge' });
//     }
// });

// app.post('/register-verify', async (req, res) => {
//     const { userId, cred }  = req.body;

//     try {
//         const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
//         if (userResult.rows.length === 0) return res.status(404).json({ error: 'User not found!' });

//         const user = userResult.rows[0];
//         const challenge = user.challenge;

//         const verificationResult = await verifyRegistrationResponse({
//             expectedChallenge: challenge,
//             expectedOrigin: 'http://localhost:3000',
//             expectedRPID: 'localhost',
//             response: cred,
//         });

//         console.log('Verification Result:', verificationResult);

//         if (!verificationResult.verified) return res.json({ error: 'Could not verify' });

//         const { credentialID, credentialPublicKey, counter } = verificationResult.registrationInfo;

//         if (!credentialID || !credentialPublicKey || counter === undefined) {
//             console.log('Missing registration information:', verificationResult.registrationInfo);
//             return res.status(500).json({ error: 'Missing registration information' });
//         }

//         const publicKeyHex = toHexString(credentialPublicKey);

//         await pool.query(
//             'INSERT INTO passkeys (user_id, credential_id, public_key, counter) VALUES ($1, $2, $3, $4)',
//             [userId, credentialID, publicKeyHex, counter]
//         );

//         return res.json({ verified: true });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ error: 'Verification failed' });
//     }
// });

// app.post('/login-challenge', async (req, res) => {
//     const { userId } = req.body;

//     try {
//         const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
//         if (userResult.rows.length === 0) return res.status(404).json({ error: 'User not found!' });

//         const opts = await generateAuthenticationOptions({
//             rpID: 'localhost',
//         });

//         await pool.query('UPDATE users SET challenge = $1 WHERE id = $2', [opts.challenge, userId]);

//         return res.json({ options: opts });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ error: 'Failed to generate login challenge' });
//     }
// });

// app.post('/login-verify', async (req, res) => {
//     const { userId, cred }  = req.body;

//     try {
//         const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
//         if (userResult.rows.length === 0) return res.status(404).json({ error: 'User not found!' });

//         const user = userResult.rows[0];
//         const challenge = user.challenge;

//         const passkeyResult = await pool.query('SELECT * FROM passkeys WHERE user_id = $1', [userId]);
//         if (passkeyResult.rows.length === 0) return res.status(404).json({ error: 'Passkey not found!' });

//         const passkey = passkeyResult.rows[0];
//         const publicKeyUint8Array = fromHexString(passkey.public_key);

//         const result = await verifyAuthenticationResponse({
//             expectedChallenge: challenge,
//             expectedOrigin: 'http://localhost:3000',
//             expectedRPID: 'localhost',
//             response: cred,
//             authenticator: {
//                 credentialID: passkey.credential_id,
//                 credentialPublicKey: publicKeyUint8Array,
//                 counter: passkey.counter,
//             },
//         });

//         if (!result.verified) return res.json({ error: 'Something went wrong' });

//         // Update the counter in the database
//         await pool.query('UPDATE passkeys SET counter = $1 WHERE id = $2', [result.authenticationInfo.newCounter, passkey.id]);

//         return res.json({ success: true, userId });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ error: 'Login verification failed' });
//     }
// });

// app.listen(PORT, () => console.log(`Server started on PORT:${PORT}`));