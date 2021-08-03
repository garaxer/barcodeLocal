import { mapKeys, omitSingle } from '../util';

interface UserState {
  [id: string]: {
    id: string;
  };
}

interface User {
  id: string;
}

interface UserAction {
  type: string;
  payload: User;
}

const INITIAL_STATE: UserState = {};

export default (state = INITIAL_STATE, action: UserAction) => {
  switch (action.type) {
    case 'FETCH_USERS':
      return { ...state, ...mapKeys('id')(action.payload) };
    case 'DELETE_USER':
      return omitSingle(action.payload, state);
    case 'EDIT_CREATE_NEW_USER':
      return {
        ...state,
        [action.payload.id]: { ...state[action.payload.id], ...action.payload },
      };
    default:
      return state;
  }
};
