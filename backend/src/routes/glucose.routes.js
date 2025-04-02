const express = require('express');
const router = express.Router();
const glucoseController = require('../controllers/glucose.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Routes for glucose readings management
router.get('/', glucoseController.getAllReadings);
router.get('/:id', glucoseController.getReadingById);
router.post('/', glucoseController.createReading);
router.put('/:id', glucoseController.updateReading);

// Delete reading - only allowed for admin, doctor, and nurse roles
router.delete('/:id', authorize(['admin', 'doctor', 'nurse']), glucoseController.deleteReading);

// Patient specific routes
router.get('/patient/:patientId', glucoseController.getPatientReadings);
router.get('/patient/:patientId/statistics', glucoseController.getGlucoseStatistics);

module.exports = router;
