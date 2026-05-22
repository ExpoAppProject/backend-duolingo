const fs = require('fs');
const fetch = global.fetch || require('node-fetch');

const BASE = 'http://localhost:3000/api/v1';

async function run() {
  const ids = JSON.parse(fs.readFileSync('seed_out.json', 'utf8'));
  console.log('seed ids', ids);

  // register
  let res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test User', email: 'test.user@example.com', password: 'password123' }),
  });
  const reg = await res.json();
  console.log('/auth/register', res.status, reg);

  // login
  res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test.user@example.com', password: 'password123' }),
  });
  const login = await res.json();
  console.log('/auth/login', res.status, login);

  const access = login.data?.tokens?.accessToken;
  const refresh = login.data?.tokens?.refreshToken;
  if (!access) {
    console.error('No access token, aborting');
    return;
  }

  // users/me
  res = await fetch(`${BASE}/users/me`, { headers: { Authorization: `Bearer ${access}` } });
  console.log('/users/me', res.status, await res.json());

  // start course
  res = await fetch(`${BASE}/courses/${ids.courseId}/start`, { method: 'POST', headers: { Authorization: `Bearer ${access}` } });
  console.log(`/courses/${ids.courseId}/start`, res.status, await res.json());

  // get track
  res = await fetch(`${BASE}/courses/${ids.courseId}/tracks/${ids.trackId}`, { headers: { Authorization: `Bearer ${access}` } });
  console.log(`/courses/${ids.courseId}/tracks/${ids.trackId}`, res.status, await res.json());

  // complete lesson
  res = await fetch(`${BASE}/courses/lessons/${ids.lessonId}/complete`, { method: 'POST', headers: { Authorization: `Bearer ${access}` } });
  console.log(`/courses/lessons/${ids.lessonId}/complete`, res.status, await res.json());

  // refresh
  res = await fetch(`${BASE}/auth/refresh`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken: refresh }) });
  console.log('/auth/refresh', res.status, await res.json());
}

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
