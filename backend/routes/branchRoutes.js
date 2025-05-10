const express = require('express');
const router = express.Router();
const { checkPermission,auth } = require('../middleware/auth');
const branchController = require('../controllers/branchController');

// Get all branches
router.get('/', branchController.getBranches);

// Create branch
router.post('/', auth,checkPermission('manage-branches'), branchController.createBranch);

// Update branch
router.put('/:id', auth,checkPermission('manage-branches'), branchController.updateBranch);

// Delete branch
router.delete('/:id', auth,checkPermission('manage-branches'), branchController.deleteBranch);

module.exports = router; 