import React, { useRef, useEffect } from 'react';
import useBarcode from './UseBarcode';
import {
  generateZipOfImagesFromRefs,
  generateImageFromRef,
} from '../../util/generateBarcode';
import ReactDOM from 'react-dom';
// Need to do this before converting to typescript to avoid never[] https://stackoverflow.com/questions/54633690/how-can-i-use-multiple-refs-for-an-array-of-elements-with-hooks
import options from '../../barcodeOptions';
import { connect } from 'react-redux';

function Barcode({ value }) {
  const inputRef = useBarcode({
    value,
    options,
  });
  return <svg ref={inputRef} />;
}

/**
 * Makes PNG barcodes then saves them automatically.
 * For PDF barcodes please see client.
 * When it is rendered with values it will
 * create barcodes with those values and immediatly download them.
 */
const MakeBarcodes = ({ values }) => {
  const itemsRef = useRef([]);

  useEffect(() => {
    values &&
      (values.length === 1
        ? generateImageFromRef(itemsRef.current[0])
        : generateZipOfImagesFromRefs(itemsRef));
  }, [values]);

  const makeBarcodes = (plans) => {
    return plans.map((plan, i) => (
      <div key={plan} ref={(el) => (itemsRef.current[i] = el)}>
        <Barcode value={plan} />
      </div>
    ));
  };
  return ReactDOM.createPortal(
    <div style={{ position: 'absolute', bottom: 10000 }}>
      {values && makeBarcodes(values)}
    </div>,
    document.querySelector('#pngGeneratorModal')
  );
};
//
const mapStateToProps = (state, ownProps) => ({
  // Use the given prop even if it is contains nothing
  values: Object.keys(ownProps).includes('values')
    ? ownProps.values
    : state.pngBarcodes,
});

export default connect(mapStateToProps, {})(MakeBarcodes);
