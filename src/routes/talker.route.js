const { Router } = require('express');
const { getAll, getById, createTalker, upTalker } = require('../db/talkerDB');
const validateName = require('../middleware/validateName');
const validateAuth = require('../middleware/validateAuth');
const { 
  validateAge, validateTalk, validateRate, validateWatchedAt } = require('../middleware/validates');

const talkerRoutes = Router();

talkerRoutes.get('/', async (req, res) => {
  const talker = await getAll();
  return res.status(200).json(talker);
});

talkerRoutes.post('/', validateAuth, 
  validateName, validateAge, validateTalk, validateRate, validateWatchedAt, async (req, res) => {
    const { name, age, talk } = req.body;
    const talker = await createTalker({ name, age, talk });
    return res.status(201).json(talker);
  });

talkerRoutes.get('/:id', async (req, res) => {
  const { id } = req.params;
  const person = await getById(id);
  if (!person) {
    return res.status(404).send({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(200).json(person);
});

talkerRoutes.put('/:id', validateAuth, validateName, validateAge, validateTalk, validateWatchedAt, 
  validateRate, async (req, res) => {
    const { id } = req.params;
    const newTalker = req.body;
    const talker = await getById(id);
    if (!talker) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    const updatedTalker = await upTalker({ ...newTalker, id: Number(id) });
    return res.status(200).json(updatedTalker);
  });

module.exports = talkerRoutes;