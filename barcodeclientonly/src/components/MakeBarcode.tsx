import React, { useRef, useEffect } from "react";
import useBarcode from "./UseBarcodes";
import { generateZipOfImagesFromRefs, generateImageFromRef } from "../util";
import ReactDOM from "react-dom";
// Need to do this before converting to typescript to avoid never[] https://stackoverflow.com/questions/54633690/how-can-i-use-multiple-refs-for-an-array-of-elements-with-hooks
import options from "../barcodeOptions";

function Barcode({ value }: { value: string }) {
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
type MakeBarcodesType = {
  values: string[];
};
const MakeBarcodes = ({ values }: MakeBarcodesType) => {
  const itemsRef: any = useRef([]);

  useEffect(() => {
    values &&
      (values.length === 1
        ? generateImageFromRef(itemsRef.current[0])
        : generateZipOfImagesFromRefs(itemsRef));
  }, [values]);

  const makeBarcodes = (plans: string[]) => {
    return plans.map((plan, i) => (
      <div key={plan} ref={(el) => (itemsRef.current[i] = el)}>
        <Barcode value={plan} />
      </div>
    ));
  };
  const a = document.querySelector("#pngGeneratorModal");
  if (a) {
    return ReactDOM.createPortal(
      <div style={{ position: "absolute", bottom: 10000 }}>
        {values && makeBarcodes(values)}
      </div>,
      a
    );
  }
  return <></>;
};

export default MakeBarcodes;
