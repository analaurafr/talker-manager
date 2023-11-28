const { Router } = require('express');
const { getAll, getById, createTalker } = require('../db/talkerDB');
const validateToken = require('../middleware/validateToken');
const validateName = require('../middleware/validateName');
const validateAge = require('../middleware/validateAge');
const validateRate = require('../middleware/validateRate');
const validateTalk = require('../middleware/validateTalk');
const validateWatchedAt = require('../middleware/validateWatchedAt');

const talkerRoutes = Router();

talkerRoutes.get('/', async (req, res) => {
  const talker = await getAll();
  return res.status(200).json(talker);
});

talkerRoutes.get('/:id', async (req, res) => {
  const { id } = req.params;
  const person = await getById(id);
  if (!person) {
    return res.status(404).send({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(200).json(person);
});

talkerRoutes.post('/', 
  validateToken, validateName, validateAge, validateRate, validateTalk, validateWatchedAt, 
  async (req, res) => {
    const { name, age, talk } = req.body;
    const talker = await createTalker({ name, age, talk });
    return res.status(201).json(talker);
  });

module.exports = talkerRoutes;
