import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { connectRouter } from 'connected-react-router';
import authReducer from './authReducer';
import usersReducer from './usersReducer';
import loadingErrorReducer from './LoadingErrorReducer';
import barcodeReducer from './barcodeReducer';
import pngBarcodeReducer from './pngBarcodeHolder';

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    form: formReducer,
    users: usersReducer,
    usersLoading: loadingErrorReducer,
    barcodes: barcodeReducer,
    pngBarcodes: pngBarcodeReducer,
  });
export default createRootReducer;
