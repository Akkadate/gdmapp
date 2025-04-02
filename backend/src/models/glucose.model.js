const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GlucoseReading = sequelize.define('GlucoseReading', {
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
  readingDateTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  glucoseLevel: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Blood glucose level in mg/dL'
  },
  readingType: {
    type: DataTypes.ENUM('fasting', 'before_meal', 'after_meal', 'before_bed', 'random'),
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT
  },
  isAbnormal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  recordedBy: {
    type: DataTypes.UUID,
    comment: 'User who recorded the reading'
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (reading) => {
      // Check if glucose level is abnormal based on reading type
      switch(reading.readingType) {
        case 'fasting':
          reading.isAbnormal = reading.glucoseLevel > 95; // Greater than 95 mg/dL is abnormal for fasting
          break;
        case 'before_meal':
          reading.isAbnormal = reading.glucoseLevel > 100; // Example threshold
          break;
        case 'after_meal':
          reading.isAbnormal = reading.glucoseLevel > 140; // Greater than 140 mg/dL is abnormal after meal
          break;
        case 'before_bed':
          reading.isAbnormal = reading.glucoseLevel > 120; // Example threshold
          break;
        case 'random':
          reading.isAbnormal = reading.glucoseLevel > 180; // Example threshold for random reading
          break;
        default:
          reading.isAbnormal = false;
      }
    }
  }
});

module.exports = GlucoseReading;
