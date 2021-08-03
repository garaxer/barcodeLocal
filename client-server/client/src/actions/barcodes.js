import { saveAs } from 'file-saver';

import barcodeserver, { request, httpClient } from '../api/barcodeserver';
import dataProvider from './dataProvider';

// import history from '../history';
import { getFormattedDate } from '../util';

const fetcher = dataProvider('', httpClient);
const resource = 'barcodes';

export const getBarcodes = (
  options = {
    pagination: { page: 1, perPage: 5 },
    sort: { field: 'id', order: 'desc' },
    filter: {},
  },
  callBack = console.log
) => async (dispatch) => {
  const { data, total } = await fetcher.getManyReference(resource, options);
  callBack(total);
  //   import qs from 'query-string';
  // import { push } from 'connected-react-router';
  // const { page, perPage } = options.pagination;
  // const { field, order } = options.sort;
  // dispatch(
  //   push(
  //     `?${qs.stringify({
  //       page,
  //       perPage,
  //       field,
  //       order,
  //       filter: JSON.stringify(options.filter),
  //     })}`
  //   )
  // );
  return data.error
    ? dispatch({ type: 'BARCODES_ERROR', payload: data.error })
    : dispatch({ type: 'FETCH_BARCODES', payload: data });
};

/* TODO: Change this to fetch from axios */
export const getBarcode = (barcodeLabels) => async (dispatch) => {
  console.log('getting barcodes', barcodeLabels);
  try {
    console.log('aaa');
    console.log(localStorage.getItem('csrfToken'));
    const response = await barcodeserver.post(
      '/generate',
      { barcodeLabels },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': localStorage.getItem('csrfToken'),
          // Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
        responseType: 'blob',
      }
    );

    const dataType = response.data.type.split('/')[1];
    saveAs(
      response.data,
      `${
        barcodeLabels.length === 1
          ? barcodeLabels[0]
          : `${getFormattedDate()}_pdf_barcodes`
      }.${dataType}`
    );
    dispatch({ type: 'GENERATE_RESPONSE', payload: barcodeLabels });
  } catch (error) {
    console.log(error);
    dispatch({
      type: 'GENERATE_ERROR',
      payload: error?.response?.statusText || 'Unknown server issue.',
    });
  }
};

/**
 * Gets a list of the latest barcodes
 * @param {*} param0
 * @param {*} barcodeType
 * @param {*} token
 * @param {*} getPngBarcodes
 */
export const getFiles = (
  { planCount: count, planType: bprefix },
  barcodeType,
  token,
  getPngBarcodes
) => async (dispatch) => {
  const latestPlansData = {
    bprefix,
    count,
  };
  const { barcodeLabels, error } = await request(
    `/barcodes/latest`,
    'POST',
    token,
    latestPlansData
  );
  if (error) {
    return dispatch({ type: 'GENERATE_ERROR', payload: error });
  }

  switch (barcodeType) {
    case 'BOTH':
      getPngBarcodes(barcodeLabels);
      getBarcode(barcodeLabels, token)(dispatch);
      break;
    case 'PNG':
      getPngBarcodes(barcodeLabels);

      dispatch({ type: 'GENERATE_RESPONSE', payload: barcodeLabels });
      break;
    case 'PDF':
      getBarcode(barcodeLabels, token)(dispatch);
      break;

    default:
      break;
  }
};
