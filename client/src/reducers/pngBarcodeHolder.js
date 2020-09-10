// When this state changes new barcodes will be saved.
export default (state = null, action) => {
  switch (action.type) {
    case 'GET_PNG_BARCODES':
      console.log('getting png')
      return action.payload;
    default:
      return state;
  }
};
