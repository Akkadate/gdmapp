const { User } = require('../models');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, password, email, fullName, role } = req.body;
    
    // Create new user
    const newUser = await User.create({
      username,
      password,
      email,
      fullName,
      role
    });
    
    // Return created user (exclude password)
    const userResponse = newUser.toJSON();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Create user error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, fullName, role, isActive } = req.body;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user data
    await user.update({
      username,
      email,
      fullName,
      role,
      isActive
    });
    
    // Return updated user (exclude password)
    const userResponse = user.toJSON();
    delete userResponse.password;
    
    res.json(userResponse);
  } catch (error) {
    console.error('Update user error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Instead of hard delete, just set as inactive
    await user.update({ isActive: false });
    
    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
