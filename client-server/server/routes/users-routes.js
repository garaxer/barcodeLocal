const express = require('express');
const adminOrUserAuth = require('../middleware/adminOrUserAuth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

const {
  getUsers,
  getUser,
  createUser,
  editUser,
  deleteUser,
  me,
  logout,
  logoutall,
  login,
} = require('../controllers/users-controller');

// User routes
router.post('/login', login);
router.get('/me', me);
router.post('/me/logout', logout);
router.post('/me/logoutall', logoutall);

// Rest routes
router.post('', adminAuth, createUser);
router.get('', adminAuth, getUsers);
router.get('/:id', adminOrUserAuth, getUser);
router.put('/:id', adminOrUserAuth, editUser);
router.delete('/:id', adminAuth, deleteUser);

module.exports = router;
