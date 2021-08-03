import { saveAs } from "file-saver";
import JSZip from "jszip";
import * as htmlToImage from "html-to-image";

export const generateZipOfImagesFromRefs = async (inputRefs: any) => {
  const zip = new JSZip();
  await Promise.all(
    inputRefs.current.map(async (inputRef: any, i: any) => {
      const blob = await htmlToImage.toBlob(inputRef);
      zip.file(`${inputRef.innerText || `unknown${i}`}.png`, blob as null);
    })
  );

  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, `${getFormattedDate()}_png_barcodes.zip`);
  });
};

export const generateImageFromRef = async (inputRef: any) => {
  const blob = await htmlToImage.toBlob(inputRef);
  if (blob) {
    saveAs(blob, `${inputRef.innerText || "unknown"}.png`);
  }
};

export const getFormattedDate = (date = new Date()) => {
  let dateTimeFormat = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
  let [{ value: month }, , { value: day }, , { value: year }] =
    dateTimeFormat.formatToParts(date);
  return `${day}-${month}-${year}`;
};
