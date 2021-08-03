const express = require('express');
const adminOrUserAuth = require('../middleware/adminOrUserAuth');

const adminAuth = require('../middleware/adminAuth');
const {
  createBarcode,
  editBarcode,
  getBarcodes,
  getBarcode,
  deleteBarcode,
  createLatestBarcodes,
} = require('../controllers/barcodes-controller');

const router = express.Router();

// Rest routes
router.get('', getBarcodes);
router.get('/:id', adminAuth, getBarcode);
router.post('', adminAuth, createBarcode);
router.put('/:id', adminAuth, editBarcode);
router.delete('/:id', adminAuth, deleteBarcode);

// non-Rest routes
router.post('/latest', createLatestBarcodes);

module.exports = router;
