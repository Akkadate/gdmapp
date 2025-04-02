const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  patientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Patients',
      key: 'id'
    }
  },
  doctorId: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  appointmentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  appointmentTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
    comment: 'Duration in minutes'
  },
  appointmentType: {
    type: DataTypes.ENUM('regular_checkup', 'glucose_monitoring', 'ultrasound', 'consultation', 'emergency'),
    defaultValue: 'regular_checkup'
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'rescheduled', 'no_show'),
    defaultValue: 'scheduled'
  },
  notes: {
    type: DataTypes.TEXT
  },
  reminderSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  createdBy: {
    type: DataTypes.UUID,
    comment: 'User who created the appointment'
  }
}, {
  timestamps: true
});

module.exports = Appointment;
