const { Patient, User, GlucoseReading, Appointment } = require('../models');
const { Op } = require('sequelize');

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      where: { isActive: true },
      include: [
        {
          model: User,
          as: 'primaryDoctor',
          attributes: ['id', 'fullName']
        }
      ]
    });
    res.json(patients);
  } catch (error) {
    console.error('Get all patients error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const patient = await Patient.findOne({
      where: { id, isActive: true },
      include: [
        {
          model: User,
          as: 'primaryDoctor',
          attributes: ['id', 'fullName']
        },
        {
          model: GlucoseReading,
          as: 'glucoseReadings',
          limit: 10,
          order: [['readingDateTime', 'DESC']]
        },
        {
          model: Appointment,
          as: 'appointments',
          limit: 5,
          where: { status: 'scheduled' },
          order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']],
          required: false
        }
      ]
    });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json(patient);
  } catch (error) {
    console.error('Get patient by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createPatient = async (req, res) => {
  try {
    const patientData = req.body;
    
    // Calculate BMI if height and prePregnancyWeight are provided
    if (patientData.height && patientData.prePregnancyWeight) {
      const heightInMeters = patientData.height / 100;
      patientData.bmi = (patientData.prePregnancyWeight / (heightInMeters * heightInMeters)).toFixed(2);
    }
    
    // Create new patient
    const newPatient = await Patient.create(patientData);
    
    res.status(201).json(newPatient);
  } catch (error) {
    console.error('Create patient error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        message: 'Patient with this hospital number or ID number already exists'
      });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patientData = req.body;
    
    const patient = await Patient.findOne({
      where: { id, isActive: true }
    });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Calculate BMI if height and weight are provided
    if (patientData.height && patientData.currentWeight) {
      const heightInMeters = patientData.height / 100;
      patientData.bmi = (patientData.currentWeight / (heightInMeters * heightInMeters)).toFixed(2);
    }
    
    // Update patient data
    await patient.update(patientData);
    
    res.json(patient);
  } catch (error) {
    console.error('Update patient error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        message: 'Patient with this hospital number or ID number already exists'
      });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    
    const patient = await Patient.findByPk(id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Soft delete (set as inactive)
    await patient.update({ isActive: false });
    
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPatientStatistics = async (req, res) => {
  try {
    const activePatients = await Patient.count({ where: { isActive: true } });
    const highRiskPatients = await Patient.count({ where: { isActive: true, riskLevel: 'high' } });
    const newPatients = await Patient.count({
      where: {
        isActive: true,
        createdAt: {
          [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });
    
    res.json({
      activePatients,
      highRiskPatients,
      newPatients
    });
  } catch (error) {
    console.error('Get patient statistics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
