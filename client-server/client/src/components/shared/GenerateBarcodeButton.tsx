import React, { useState } from 'react';
import { Button, ButtonGroup } from '@material-ui/core';
import { getPngBarcodes } from '../../actions';
import { getBarcode } from '../../actions/barcodes';
import { useDispatch } from 'react-redux';

const GenerateBarcodeButton = ({ barcodes }: { barcodes: string[] }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const generateBarcodes = () => {
    setLoading(true);

    const callBack = (value: string[]) => {
      console.log(value);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    getBarcode(barcodes)(callBack);
  };

  const generatePNGBarcodes = () => {
    setLoading(true);

    dispatch(getPngBarcodes(barcodes)); // Is dispatched to start the react portal png generator
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <ButtonGroup color="secondary" aria-label="outlined secondary button group">
      <Button disabled={loading} onClick={() => generateBarcodes()}>
        PDF
      </Button>

      <Button disabled={loading} onClick={() => generatePNGBarcodes()}>
        PNG
      </Button>
    </ButtonGroup>
  );
};

export default GenerateBarcodeButton;
