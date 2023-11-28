const { Router } = require('express');
const { getAll } = require('../db/talkerDB');

const talkerRoutes = Router();

talkerRoutes.get('/', async (_req, res) => {
  const talker = await getAll();
  return res.status(200).json(talker);
});

module.exports = talkerRoutes;
