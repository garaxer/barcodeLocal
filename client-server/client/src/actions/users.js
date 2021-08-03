import { request, httpClient } from '../api/barcodeserver';
import dataProvider from './dataProvider';
import { resetLoginErrors, signIn } from './index';
import { push } from 'connected-react-router';

const fetcher = dataProvider('', httpClient);
const resource = 'users';

/**
 * Call the login API. TODO:Change from axios call.
 * @param {object} creds
 * will contain the email and password, you will get a token back inside respose.data
 */
export const login = (creds) => async (dispatch) => {
  dispatch(resetLoginErrors());

  const { csrfToken, error } = await request('/csrf-token', 'GET', null);
  if (error) {
    console.log('csrf token error');
    dispatch({ type: 'SIGN_OUT_IN_ERROR', payload: error });
  }
  if (csrfToken) {
    localStorage.setItem('csrfToken', csrfToken);

    const response = await request('/users/login', 'POST', null, creds);

    if (response.error) {
      console.log('login error');

      dispatch({ type: 'SIGN_OUT_IN_ERROR', payload: response.error });
    } else {
      dispatch({ type: 'EDIT_CREATE_NEW_USER', payload: response.user });
      dispatch(signIn(response));

      dispatch(push('./'));
    }
  }
};

export const logout = (token) => async (dispatch) => {
  const response = await request('/users/me/logoutall', 'POST', token, null);
  if (response.error) {
    dispatch({ type: 'SIGN_OUT_IN_ERROR', payload: response.error });
  } else {
    dispatch({ type: 'SIGN_OUT', payload: response });
  }
  console.log('logging out');
  window.location.reload();
};

export const fetchMe = (token) => async (dispatch) => {
  const response = await request('/users/me', 'GET', null, null);
  if (response.error) {
    dispatch({ type: 'SIGN_OUT_IN_ERROR', payload: response.error });
    dispatch({ type: 'SIGN_OUT', payload: response });
  } else {
    dispatch(signIn({ user: response, token }));
    dispatch({ type: 'EDIT_CREATE_NEW_USER', payload: response });
  }
};

// Handles changes to the user store
const editUserState = (
  path,
  method,
  token,
  body,
  redirectWhenFinished = false
) => async (dispatch, getState) => {
  const { id, permission } = getState().auth.user;
  dispatch({ type: 'USERS_LOADING', payload: true });
  const response = await request(path, method, token, body);

  if (response.error) {
    dispatch({ type: 'USERS_ERROR_LOADING', payload: response.error });
    response.error.toLowerCase().includes('unauthorized') &&
      dispatch(push('/login'));
  } else {
    dispatch({ type: 'EDIT_CREATE_NEW_USER', payload: response });
    dispatch({ type: 'USERS_LOADING', payload: false });
    dispatch({ type: 'LOADED', payload: '' });

    if (redirectWhenFinished) {
      if (permission === 'admin') {
        dispatch(push('/users'));
        dispatch({ type: 'LOADED', payload: 'Admin Edit Successful' });
      } else if (body.password) {
        // Need to check if the current user is an admin and is changing their own password
        dispatch({ type: 'SIGN_OUT', payload: '' });
        // This might be needed if we check the users refresh token, find the user using the refresh token in /me to resolve
        // localStorage.removeItem('csrfToken');

        dispatch(push('/login'));
        dispatch({
          type: 'LOADED',
          payload: 'Password Changed, please log back in.',
        });
      } else {
        dispatch(push(`/users/profile/${id}`));
        dispatch({ type: 'LOADED', payload: 'Edit Successful' });
      }
    }
  }
};

export const fetchUser = (token, id) => async (dispatch, getState) => {
  editUserState(`/users/${id}`, 'GET', token, null)(dispatch, getState);
};

export const newUser = (token, data) => async (dispatch, getState) => {
  editUserState('/users/', 'POST', token, data, true)(dispatch, getState);
};

export const editUser = (token, id, body, redirect = true) => async (
  dispatch,
  getState
) => {
  console.log('editing user');
  editUserState(
    `/users/${id}`,
    'PUT',
    token,
    body,
    redirect
  )(dispatch, getState);
};

export const deleteUser = (id) => async (dispatch, getState) => {
  const { token } = getState().auth;
  const response = await request(`/users/${id}`, 'DELETE', token, null);
  response.error
    ? dispatch({ type: 'USERS_ERROR_LOADING', payload: response.error })
    : dispatch({ type: 'DELETE_USER', payload: id });
};

export const fetchUsers = (options) => async (dispatch, getState) => {
  const { orderBy, ordering, rangeStart, rangeEnd, filter } = options || {};
  // ?sort=["createdAt","DESC"]&range=[0,210]&filter={"bprefix":"AP"}
  const url = `/users/${
    options
      ? `?sort=["${orderBy}","${ordering}"]&range=[${rangeStart},${rangeEnd}]&filter=${JSON.stringify(
          filter
        )}`
      : ''
  }`;

  const response = await request(url, 'GET', null, null);
  if (response.error) {
    dispatch({ type: 'USERS_ERROR_LOADING', payload: response.error });
    response.error.toLowerCase().includes('unauthorized') &&
      dispatch(push('/login'));
  } else {
    dispatch({ type: 'FETCH_USERS', payload: response });
  }
};

export const getAUser = async () => {
  const response = await fetcher.getOne(resource, { id: 20 });
  return response;
};

export const getUsers = (
  options = {
    pagination: { page: 1, perPage: 5 },
    sort: { field: 'id', order: 'desc' },
    filter: {},
  },
  callBack = console.log
) => async (dispatch) => {
  const { data, total } = await fetcher.getManyReference(resource, options);
  callBack(total);
  return data.error
    ? dispatch({ type: 'USERS_ERROR_LOADING', payload: data.error })
    : dispatch({ type: 'FETCH_USERS', payload: data });
};
