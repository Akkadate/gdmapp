const User = require('./user.model');
const Patient = require('./patient.model');
const GlucoseReading = require('./glucose.model');
const Appointment = require('./appointment.model');

// Define associations

// User - Patient (primary doctor)
User.hasMany(Patient, {
  foreignKey: 'primaryDoctorId',
  as: 'patients'
});
Patient.belongsTo(User, {
  foreignKey: 'primaryDoctorId',
  as: 'primaryDoctor'
});

// Patient - GlucoseReading
Patient.hasMany(GlucoseReading, {
  foreignKey: 'patientId',
  as: 'glucoseReadings'
});
GlucoseReading.belongsTo(Patient, {
  foreignKey: 'patientId',
  as: 'patient'
});

// User - GlucoseReading (who recorded it)
User.hasMany(GlucoseReading, {
  foreignKey: 'recordedBy',
  as: 'recordedReadings'
});
GlucoseReading.belongsTo(User, {
  foreignKey: 'recordedBy',
  as: 'recorder'
});

// Patient - Appointment
Patient.hasMany(Appointment, {
  foreignKey: 'patientId',
  as: 'appointments'
});
Appointment.belongsTo(Patient, {
  foreignKey: 'patientId',
  as: 'patient'
});

// User (Doctor) - Appointment
User.hasMany(Appointment, {
  foreignKey: 'doctorId',
  as: 'doctorAppointments'
});
Appointment.belongsTo(User, {
  foreignKey: 'doctorId',
  as: 'doctor'
});

// User - Appointment (who created it)
User.hasMany(Appointment, {
  foreignKey: 'createdBy',
  as: 'createdAppointments'
});
Appointment.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator'
});

module.exports = {
  User,
  Patient,
  GlucoseReading,
  Appointment
};
