// https://github.com/createnextapp/react-barcode
import { useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';

interface Props {
  value: string;
  options?: Options;
}

interface Options {
  format?: string;
  width?: number;
  height?: number;
  displayValue?: boolean;
  text?: string;
  fontOptions?: string;
  font?: string;
  textAlign?: string;
  textPosition?: string;
  textMargin?: number;
  fontSize?: number;
  background?: string;
  lineColor?: string;
  margin?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  flat?: boolean;
}

function UseBarcode(props: Props): any {
  const inputRef = useRef();
  const { value, options } = props;

  useEffect(() => {
    JsBarcode(inputRef.current, value, options);
  }, [value, options]);

  return inputRef;
}

export default UseBarcode;

