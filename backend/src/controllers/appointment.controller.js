const { Appointment, Patient, User } = require('../models');
const { Op } = require('sequelize');

exports.getAllAppointments = async (req, res) => {
  try {
    const { startDate, endDate, status, doctorId } = req.query;
    
    // Build query conditions
    const where = {};
    
    if (startDate && endDate) {
      where.appointmentDate = {
        [Op.between]: [startDate, endDate]
      };
    } else if (startDate) {
      where.appointmentDate = {
        [Op.gte]: startDate
      };
    } else if (endDate) {
      where.appointmentDate = {
        [Op.lte]: endDate
      };
    }
    
    if (status) {
      where.status = status;
    }
    
    if (doctorId) {
      where.doctorId = doctorId;
    }
    
    const appointments = await Appointment.findAll({
      where,
      include: [
        {
          model: Patient,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'hospitalNumber'],
          where: { isActive: true }
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'fullName']
        }
      ],
      order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']]
    });
    
    res.json(appointments);
  } catch (error) {
    console.error('Get all appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findByPk(id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'hospitalNumber', 'phoneNumber', 'email']
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'fullName']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullName']
        }
      ]
    });
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json(appointment);
  } catch (error) {
    console.error('Get appointment by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPatientAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { status } = req.query;
    
    // Check if patient exists
    const patient = await Patient.findOne({
      where: { id: patientId, isActive: true }
    });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Build query conditions
    const where = { patientId };
    
    if (status) {
      where.status = status;
    }
    
    const appointments = await Appointment.findAll({
      where,
      include: [
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'fullName']
        }
      ],
      order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']]
    });
    
    res.json(appointments);
  } catch (error) {
    console.error('Get patient appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date, status } = req.query;
    
    // Check if doctor exists
    const doctor = await User.findOne({
      where: { id: doctorId, role: 'doctor', isActive: true }
    });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Build query conditions
    const where = { doctorId };
    
    if (date) {
      where.appointmentDate = date;
    }
    
    if (status) {
      where.status = status;
    }
    
    const appointments = await Appointment.findAll({
      where,
      include: [
        {
          model: Patient,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'hospitalNumber'],
          where: { isActive: true }
        }
      ],
      order: [['appointmentTime', 'ASC']]
    });
    
    res.json(appointments);
  } catch (error) {
    console.error('Get doctor appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate, appointmentTime, duration, appointmentType, notes } = req.body;
    
    // Check if patient exists
    const patient = await Patient.findOne({
      where: { id: patientId, isActive: true }
    });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Check if doctor exists (if provided)
    if (doctorId) {
      const doctor = await User.findOne({
        where: { id: doctorId, role: 'doctor', isActive: true }
      });
      
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
    }
    
    // Add user ID from auth token as creator
    const createdBy = req.user ? req.user.id : null;
    
    // Create new appointment
    const newAppointment = await Appointment.create({
      patientId,
      doctorId,
      appointmentDate,
      appointmentTime,
      duration: duration || 30,
      appointmentType: appointmentType || 'regular_checkup',
      notes,
      status: 'scheduled',
      createdBy
    });
    
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctorId, appointmentDate, appointmentTime, duration, appointmentType, status, notes } = req.body;
    
    const appointment = await Appointment.findByPk(id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if doctor exists (if provided)
    if (doctorId && doctorId !== appointment.doctorId) {
      const doctor = await User.findOne({
        where: { id: doctorId, role: 'doctor', isActive: true }
      });
      
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
    }
    
    // Update appointment data
    await appointment.update({
      doctorId,
      appointmentDate,
      appointmentTime,
      duration,
      appointmentType,
      status,
      notes,
      // Reset reminder sent if date/time changes
      reminderSent: (appointmentDate !== appointment.appointmentDate || appointmentTime !== appointment.appointmentTime) ? false : appointment.reminderSent
    });
    
    res.json(appointment);
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;
    
    const appointment = await Appointment.findByPk(id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if appointment can be cancelled
    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
      return res.status(400).json({
        message: `Appointment cannot be cancelled because it is already ${appointment.status}`
      });
    }
    
    // Update appointment status to cancelled
    await appointment.update({
      status: 'cancelled',
      notes: cancellationReason ? `${appointment.notes || ''} \n\nCancellation reason: ${cancellationReason}` : appointment.notes
    });
    
    res.json({
      message: 'Appointment cancelled successfully',
      appointment
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUpcomingAppointments = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get upcoming appointments for the next 7 days
    const appointments = await Appointment.findAll({
      where: {
        appointmentDate: {
          [Op.between]: [today, new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]]
        },
        status: 'scheduled'
      },
      include: [
        {
          model: Patient,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'hospitalNumber', 'phoneNumber'],
          where: { isActive: true }
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'fullName']
        }
      ],
      order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']]
    });
    
    res.json(appointments);
  } catch (error) {
    console.error('Get upcoming appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTodayAppointments = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get today's appointments
    const appointments = await Appointment.findAll({
      where: {
        appointmentDate: today,
        status: {
          [Op.in]: ['scheduled', 'completed']
        }
      },
      include: [
        {
          model: Patient,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'hospitalNumber'],
          where: { isActive: true }
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'fullName']
        }
      ],
      order: [['appointmentTime', 'ASC']]
    });
    
    // Group appointments by status
    const result = {
      scheduled: appointments.filter(a => a.status === 'scheduled'),
      completed: appointments.filter(a => a.status === 'completed'),
      total: appointments.length
    };
    
    res.json(result);
  } catch (error) {
    console.error('Get today appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
