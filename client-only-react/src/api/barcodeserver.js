import axios from 'axios';

console.log('process.env.API_URL ss');
console.log(process.env);

console.log(process.env.API_URL);
console.log(process.env.REACT_APP_API_URL);

export const baseUrl =
  process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
console.log(baseUrl);
export const httpClient = async (url, options) => {
  try {
    const resp = await fetch(`${baseUrl}${url}`, {
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': localStorage.getItem('csrfToken'),
      }),
      credentials: 'include',
      ...options,
    });

    // Needs refactoring.
    // If the response is ok, return it
    if (resp.ok) {
      const json = await resp.json();
      return { json, headers: resp.headers };
    }

    // If the response is not ok we need to double check it contains json
    const contentType = resp.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const json = await resp.json();
      if (json.error && json.error.toLowerCase().includes('unauthorized')) {
        console.log(json);

        window.location.reload();
        console.log(json);

        // TODO: Redirect to login with error instead
        // THis can be done by currying push and dispatch as extra params.
      }
      return { json, headers: resp.headers };
    }
    // otherwise send back the status text as an error
    return { json: { error: resp.statusText } };
  } catch (error) {
    console.log(error);
    console.log(error.message);
    if (error.message === 'Failed to fetch') {
      return { json: { error: 'Network Error: Server Unreachable' } };
    }
    return { json: { error: 'Unknown Server Error' } };
  }
};

//TODO change any function that uses this to use httpClient instead
/**
 * @param {string} path
 * @param {string} method
 * @param {*=} body
 * @returns {Promise<*>}
 */
export const request = async (path, method = 'GET', _, body = null) => {
  const { json } = await httpClient(path, {
    method,
    body: body && JSON.stringify(body),
  });

  return json;
};

export default axios.create({
  baseURL: baseUrl,
});
