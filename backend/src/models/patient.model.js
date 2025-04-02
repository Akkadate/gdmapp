const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  hospitalNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'National ID number'
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  address: {
    type: DataTypes.TEXT
  },
  emergencyContact: {
    type: DataTypes.STRING
  },
  emergencyContactPhone: {
    type: DataTypes.STRING
  },
  gestationalAge: {
    type: DataTypes.INTEGER,
    comment: 'Age of pregnancy in weeks at diagnosis'
  },
  expectedDeliveryDate: {
    type: DataTypes.DATEONLY
  },
  height: {
    type: DataTypes.FLOAT,
    comment: 'Height in cm'
  },
  prePregnancyWeight: {
    type: DataTypes.FLOAT,
    comment: 'Pre-pregnancy weight in kg'
  },
  currentWeight: {
    type: DataTypes.FLOAT,
    comment: 'Current weight in kg'
  },
  bmi: {
    type: DataTypes.FLOAT,
    comment: 'Body Mass Index'
  },
  priorGDM: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Had GDM in previous pregnancies'
  },
  familyHistoryDiabetes: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  notes: {
    type: DataTypes.TEXT
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  riskLevel: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  primaryDoctorId: {
    type: DataTypes.UUID,
    comment: 'Reference to primary doctor'
  }
}, {
  timestamps: true
});

module.exports = Patient;
