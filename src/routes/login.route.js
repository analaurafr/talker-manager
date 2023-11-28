const express = require('express');
const generateToken = require('../utils/generateToken');
const validateEmail = require('../middleware/validateEmail');
const validatePassword = require('../middleware/validatePassword');

const loginRoute = express.Router();

loginRoute.post('/', validateEmail, validatePassword, (req, res) => {
  const token = generateToken();

  return res.status(200).json({ token });
});

module.exports = loginRoute;