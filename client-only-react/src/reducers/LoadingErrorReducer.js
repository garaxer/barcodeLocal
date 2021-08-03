// TODO add a key for each state to tracking loading and errors.
export default (state = { error: '', loading: false, message: '' }, action) => {
  switch (action.type) {
    case 'USERS_ERROR_LOADING':
      return { error: action.payload, loading: false, message: state.message };
    case 'USERS_LOADING':
      return { error: '', loading: action.payload, message: state.message };
    case 'LOADED':
      return { error: '', loading: false, message: action.payload };
    case 'BARCODES_ERROR':
      return { error: action.payload, loading: false, message: '' };
    default:
      return state;
  }
};
