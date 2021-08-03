import authReducer from './authReducer';

it('equals numbers', () => {
  expect(3).toEqual(3);
  expect(4).toEqual(4);
});

const initialAuthState = {
  isSignedIn: false,
  user: null,
  token: null,
  loginError: false,
};
it('signs a user out', () => {
  expect(
    authReducer(initialAuthState, { action: 'SIGN_OUT', payload: null })
  ).toEqual({
    isSignedIn: false,
    user: null,
    token: null,
    loginError: false,
  });
});
