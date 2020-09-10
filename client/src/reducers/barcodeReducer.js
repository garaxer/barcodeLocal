import { mapWithTwoKeys, omitSingle } from '../util';

export default (state = null, action) => {
  switch (action.type) {
    case 'FETCH_BARCODES':
      return {
        ...state,
        ...mapWithTwoKeys('bprefix', 'bnumber')(action.payload),
      };
    case 'ADD_BARCODE':

      return {
        ...mapWithTwoKeys('bprefix', 'bnumber')(action.payload),
        ...state,
      };
    case 'DELETE_BARCODE':
      return omitSingle(action.payload, state);
    default:
      return state;
  }
};
