interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  isSignedIn: boolean | string;
  user: User | null;
  loginError: boolean;
}

interface AuthAction {
  type: string;
  payload: AuthState;
}

const INITIAL_STATE: AuthState = {
  isSignedIn: 'waiting',
  user: null,
  loginError: false,
};

export default (state = INITIAL_STATE, action: AuthAction) => {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        ...state,
        isSignedIn: true,
        user: action.payload.user,
        loginError: false,
      };
    case 'SIGN_OUT':
      return { loginError: false, isSignedIn: false, user: null };
    case 'SIGN_OUT_IN_ERROR':
      return {
        isSignedIn: false,
        user: null,
        loginError: action.payload,
      };
    case 'RESET_LOGIN_ERRORS':
      return { ...state, loginError: action.payload };
    default:
      return state;
  }
};
