import { Parser } from 'json2csv';
import { saveAs } from 'file-saver';

const expotToCsv = (data, fields, name = 'barcodes') => {
  const opts = { fields };
  try {
    const parser = new Parser(opts);
    const csv = parser.parse(data);
    var blob = new Blob([csv], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${name}.csv`);
  } catch (err) {
    console.error(err);
  }
};

export default expotToCsv;
