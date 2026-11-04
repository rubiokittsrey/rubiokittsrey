// one-time: authorize the spotify app as the playlist owner and print a refresh token for
// SPOTIFY_REFRESH_TOKEN. spotify only returns playlist items to the playlist's owner, so the
// server needs a token minted for that account.
//
// 1. in the spotify developer dashboard, add this redirect uri to the app:
//      http://127.0.0.1:8888/callback
// 2. put SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local
// 3. node --env-file=.env.local scripts/spotify-auth.mjs, open the printed url, log in as the
//    playlist owner and approve

import { randomBytes } from 'node:crypto';
import { createServer } from 'node:http';

const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = process.env;
if (!id || !secret) {
    console.error('set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET (e.g. --env-file=.env.local)');
    process.exit(1);
}

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const state = randomBytes(16).toString('hex');

const authorizeUrl = new URL('https://accounts.spotify.com/authorize');
authorizeUrl.search = new URLSearchParams({
    client_id: id,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    state,
}).toString();

const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', REDIRECT_URI);
    if (url.pathname !== '/callback') {
        res.writeHead(404).end();
        return;
    }

    const fail = (message) => {
        res.writeHead(400, { 'Content-Type': 'text/plain' }).end(message);
        console.error(message);
        server.close();
        process.exitCode = 1;
    };

    if (url.searchParams.get('state') !== state) return fail('state mismatch');
    const code = url.searchParams.get('code');
    if (!code) return fail(`authorization failed: ${url.searchParams.get('error')}`);

    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI,
        }),
    });
    if (!tokenRes.ok) return fail(`token exchange failed (${tokenRes.status})`);

    const { refresh_token } = await tokenRes.json();
    res.writeHead(200, { 'Content-Type': 'text/plain' }).end('done, back to the terminal');
    console.log(`\nSPOTIFY_REFRESH_TOKEN=${refresh_token}\n`);
    server.close();
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`open this url and approve:\n\n${authorizeUrl}\n`);
});
