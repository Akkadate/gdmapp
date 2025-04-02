const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Routes for appointment management
router.get('/', appointmentController.getAllAppointments);
router.get('/upcoming', appointmentController.getUpcomingAppointments);
router.get('/today', appointmentController.getTodayAppointments);
router.get('/:id', appointmentController.getAppointmentById);
router.post('/', appointmentController.createAppointment);
router.put('/:id', appointmentController.updateAppointment);
router.put('/:id/cancel', appointmentController.cancelAppointment);

// Patient and doctor specific routes
router.get('/patient/:patientId', appointmentController.getPatientAppointments);
router.get('/doctor/:doctorId', appointmentController.getDoctorAppointments);

module.exports = router;
