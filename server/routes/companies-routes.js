const express = require('express');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

const {
  createCompany,
  getCompany,
  getCompanies,
  editCompany,
  deleteCompany,
} = require('../controllers/companies-controller');

// Rest routes
router.post('', adminAuth, createCompany);
router.get('/:id', adminAuth, getCompany);
router.get('', adminAuth, getCompanies);
router.put('/:id', adminAuth, editCompany);
router.delete('/:id', adminAuth, deleteCompany);

module.exports = router;
