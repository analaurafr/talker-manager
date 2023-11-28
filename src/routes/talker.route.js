const { Router } = require('express');
const { getAll, getById } = require('../db/talkerDB');

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

module.exports = talkerRoutes;
