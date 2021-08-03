export const signIn = (payload) => ({
  type: 'SIGN_IN',
  payload,
});

export const signedOut = () => ({
  type: 'SIGN_OUT',
});

export const clearUserErrors = () => ({
  type: 'USERS_LOADING',
  payload: false,
});

export const addBarcodes = (payload) => ({
  type: 'ADD_BARCODE',
  payload,
});

export const resetLoginErrors = () => ({
  type: 'RESET_LOGIN_ERRORS',
  payload: false,
});

export const getPngBarcodes = (barcodes) => ({
  type: 'GET_PNG_BARCODES',
  payload: barcodes,
});
