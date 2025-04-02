const { GlucoseReading, Patient } = require('../models');
const { Op } = require('sequelize');

exports.getAllReadings = async (req, res) => {
  try {
    const { patientId, startDate, endDate, isAbnormal } = req.query;
    
    // Build query conditions
    const where = {};
    
    if (patientId) {
      where.patientId = patientId;
    }
    
    if (startDate && endDate) {
      where.readingDateTime = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      where.readingDateTime = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      where.readingDateTime = {
        [Op.lte]: new Date(endDate)
      };
    }
    
    if (isAbnormal !== undefined) {
      where.isAbnormal = isAbnormal === 'true';
    }
    
    const readings = await GlucoseReading.findAll({
      where,
      include: [
        {
          model: Patient,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'hospitalNumber']
        }
      ],
      order: [['readingDateTime', 'DESC']]
    });
    
    res.json(readings);
  } catch (error) {
    console.error('Get all readings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReadingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const reading = await GlucoseReading.findByPk(id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'hospitalNumber']
        }
      ]
    });
    
    if (!reading) {
      return res.status(404).json({ message: 'Reading not found' });
    }
    
    res.json(reading);
  } catch (error) {
    console.error('Get reading by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPatientReadings = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { limit = 50, offset = 0, startDate, endDate } = req.query;
    
    // Check if patient exists
    const patient = await Patient.findOne({
      where: { id: patientId, isActive: true }
    });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Build query conditions
    const where = { patientId };
    
    if (startDate && endDate) {
      where.readingDateTime = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      where.readingDateTime = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      where.readingDateTime = {
        [Op.lte]: new Date(endDate)
      };
    }
    
    const readings = await GlucoseReading.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['readingDateTime', 'DESC']]
    });
    
    res.json({
      total: readings.count,
      readings: readings.rows
    });
  } catch (error) {
    console.error('Get patient readings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createReading = async (req, res) => {
  try {
    const { patientId, glucoseLevel, readingType, notes } = req.body;
    
    // Check if patient exists
    const patient = await Patient.findOne({
      where: { id: patientId, isActive: true }
    });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Add user ID from auth token if available
    const recordedBy = req.user ? req.user.id : null;
    
    // Create new reading
    const newReading = await GlucoseReading.create({
      patientId,
      glucoseLevel,
      readingType,
      notes,
      recordedBy,
      readingDateTime: new Date()
    });
    
    res.status(201).json(newReading);
  } catch (error) {
    console.error('Create reading error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateReading = async (req, res) => {
  try {
    const { id } = req.params;
    const { glucoseLevel, readingType, notes, readingDateTime } = req.body;
    
    const reading = await GlucoseReading.findByPk(id);
    
    if (!reading) {
      return res.status(404).json({ message: 'Reading not found' });
    }
    
    // Update reading data
    await reading.update({
      glucoseLevel,
      readingType,
      notes,
      readingDateTime: readingDateTime ? new Date(readingDateTime) : reading.readingDateTime
    });
    
    res.json(reading);
  } catch (error) {
    console.error('Update reading error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteReading = async (req, res) => {
  try {
    const { id } = req.params;
    
    const reading = await GlucoseReading.findByPk(id);
    
    if (!reading) {
      return res.status(404).json({ message: 'Reading not found' });
    }
    
    // Delete reading
    await reading.destroy();
    
    res.json({ message: 'Reading deleted successfully' });
  } catch (error) {
    console.error('Delete reading error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getGlucoseStatistics = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Check if patient exists
    const patient = await Patient.findOne({
      where: { id: patientId, isActive: true }
    });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Get readings from the last 7 days
    const lastWeekReadings = await GlucoseReading.findAll({
      where: {
        patientId,
        readingDateTime: {
          [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });
    
    // Calculate statistics
    let totalGlucose = 0;
    let maxGlucose = 0;
    let minGlucose = Number.MAX_VALUE;
    let abnormalCount = 0;
    
    lastWeekReadings.forEach(reading => {
      totalGlucose += reading.glucoseLevel;
      maxGlucose = Math.max(maxGlucose, reading.glucoseLevel);
      minGlucose = Math.min(minGlucose, reading.glucoseLevel);
      if (reading.isAbnormal) abnormalCount++;
    });
    
    const averageGlucose = lastWeekReadings.length > 0 ? (totalGlucose / lastWeekReadings.length).toFixed(2) : 0;
    const abnormalPercentage = lastWeekReadings.length > 0 ? ((abnormalCount / lastWeekReadings.length) * 100).toFixed(2) : 0;
    
    // Get readings grouped by date for chart data
    const last14DaysReadings = await GlucoseReading.findAll({
      where: {
        patientId,
        readingDateTime: {
          [Op.gte]: new Date(new Date() - 14 * 24 * 60 * 60 * 1000)
        }
      },
      order: [['readingDateTime', 'ASC']]
    });
    
    // Format data for chart
    const chartData = last14DaysReadings.map(reading => ({
      date: reading.readingDateTime.toISOString().split('T')[0],
      readingType: reading.readingType,
      glucoseLevel: reading.glucoseLevel,
      isAbnormal: reading.isAbnormal
    }));
    
    res.json({
      totalReadings: lastWeekReadings.length,
      averageGlucose: parseFloat(averageGlucose),
      maxGlucose,
      minGlucose: minGlucose === Number.MAX_VALUE ? 0 : minGlucose,
      abnormalCount,
      abnormalPercentage: parseFloat(abnormalPercentage),
      chartData
    });
  } catch (error) {
    console.error('Get glucose statistics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
