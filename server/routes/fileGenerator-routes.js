const fs = require('fs');
const path = require('path');

const express = require('express');
const AdmZip = require('adm-zip');

const makeBarocdesWKHTML = require('../util/barcodeMaker');

const router = express.Router();

// Send a zip or pdf file back full of the requested barcodes.
const generateBarcodes = (req, res, next) => {
  try {
    const plans = req.body.barcodeLabels; // ['AP123','AP1234']
    console.log('Generating');
    console.log(req.body);
    // called after the plans have been created
    const callBack = (filesToZip) => {
      console.log('filesToZip');
      console.log(filesToZip);

      const zip = new AdmZip();

      filesToZip.map((file) => {
        return zip.addLocalFile(file);
      });

      const name = 'files.zip';
      res.contentType('application/zip');
      res.setHeader('content-disposition', `attachment; filename=${name}`);
      res.send(zip.toBuffer());

      filesToZip.map((file) => {
        return fs.unlink(file, (err) => {
          if (err) {
            return console.error(err);
          }
        });
      });
    };

    // Send the file names to the barcode maker
    const callBackOne = (fileName) => {
      console.log('fileName');
      console.log(path.join(__dirname, `../${fileName}`));
      res.contentType('application/pdf');
      res.setHeader('Content-Dispositon', `attachment; filename=${fileName}`);
      res.sendFile(path.join(__dirname, `../${fileName}`));
      res.on('finish', () => {
        console.log('finished');
        return fs.unlink(fileName, (err) => {
          if (err) {
            return console.error(err);
          }
        });
      });
    };

    makeBarocdesWKHTML(plans)
      .then((files) => {
        console.log('files');
        console.log(files);
        if (files.length === 1) {
          return callBackOne(files[0]);
        }
        return callBack(files);
      })
      .catch((e) => next(e));
  } catch (err) {
    next(err);
  }
};

router.post('', (req, res, next) => {
  console.log('generate api called');
  generateBarcodes(req, res, next);
});

exports.generateBarcodes = generateBarcodes;
module.exports = router;
