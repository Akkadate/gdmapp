const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Routes for patient management
router.get('/', patientController.getAllPatients);
router.get('/statistics', patientController.getPatientStatistics);
router.get('/:id', patientController.getPatientById);
router.post('/', patientController.createPatient);
router.put('/:id', patientController.updatePatient);

// Delete patient - only allowed for admin and doctor roles
router.delete('/:id', authorize(['admin', 'doctor']), patientController.deletePatient);

module.exports = router;
