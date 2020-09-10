async function useFetchPost(url, body, method) {
  const resp = await fetch(url, {
    method,
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }),
    body: body && JSON.stringify(body),
  });

  if (resp.ok) {
    return resp.json();
  }
}

async function useFetchPostWithCredentials(url, body, method, token) {
  const resp = await fetch(url, {
    method,
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }),
    body: body && JSON.stringify(body),
  });

  if (resp.ok) {
    return resp.json();
  }
}
let a = useFetchPost(
  'http://localhost:8080/api/users/login',
  { email: 'gary2@gary.gary', password: 'gary123!' },
  'POST'
);
a.then((x) => console.log(x));

let b = useFetchPostWithCredentials(
  'http://localhost:8080/api/users',
  undefined,
  'GET',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJnYXJ5MkBnYXJ5LmdhcnkiLCJuYW1lIjoiZ2FyeSIsInBlcm1pc3Npb24iOiJhZG1pbiIsInJlZnJlc2hfaWQiOiJlMTI2YTc5Ny1jYjQ0LTQ3MDEtODkwNS02ZDJiNjlkODAwZTQiLCJpYXQiOjE1OTQ5Njc1MTB9.C0lsYNo7RjeRGhS5xV-KLFIGRNF-jWwv7lGi0QWu34I'
);
b.then((x) => console.log(x));
