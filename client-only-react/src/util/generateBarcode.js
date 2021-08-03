import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import * as htmlToImage from 'html-to-image';
import { getFormattedDate } from '.';

export const generateZipOfImagesFromRefs = async (inputRefs) => {
  const zip = new JSZip();
  await Promise.all(
    inputRefs.current.map(async (inputRef, i) => {
      const blob = await htmlToImage.toBlob(inputRef);
      zip.file(`${inputRef.innerText || `unknown${i}`}.png`, blob);
    })
  )

  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, `${getFormattedDate()}_png_barcodes.zip`);
  });
}


export const generateImageFromRef = async (inputRef) => {
  const blob = await htmlToImage.toBlob(inputRef);
  saveAs(blob, `${inputRef.innerText || 'unknown'}.png`);
}
