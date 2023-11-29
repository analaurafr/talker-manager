const { Router } = require('express');
const { getAll, getById, createTalker, upTalker, dltTalker, 
  searchTalker } = require('../db/talkerDB');

const validateName = require('../middleware/validateName');
const validateAuth = require('../middleware/validateAuth');
const { validateAge, validateTalk, validateRate, 
  validateWatchedAt } = require('../middleware/validates');

const talkerRoutes = Router();

talkerRoutes.get('/', async (req, res) => {
  const talkers = await getAll();
  return res.status(200).json(talkers);
});

talkerRoutes.get('/search', validateAuth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      const allTalkers = await getAll();
      return res.status(200).json(allTalkers);
    }
    const talkers = await searchTalker(q);

    if (talkers.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(talkers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

talkerRoutes.get('/:id', async (req, res) => {
  const { id } = req.params;
  const person = await getById(id);
  if (!person) {
    return res.status(404).send({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(200).json(person);
});

talkerRoutes.post('/', validateAuth, 
  validateName, validateAge, validateTalk, validateRate, validateWatchedAt, async (req, res) => {
    const { name, age, talk } = req.body;
    const talkers = await createTalker({ name, age, talk });
    return res.status(201).json(talkers);
  });

talkerRoutes.put('/:id', validateAuth, validateName, validateAge, validateTalk, validateWatchedAt, 
  validateRate, async (req, res) => {
    const { id } = req.params;
    const newTalker = req.body;
    const talkers = await getById(id);
    if (!talkers) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    const updatedTalker = await upTalker({ ...newTalker, id: Number(id) });
    return res.status(200).json(updatedTalker);
  });

talkerRoutes.delete('/:id', validateAuth, async (req, res) => {
  const { id } = req.params;
  const talkers = await getById(id);
  if (!talkers) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  await dltTalker(id);
  return res.status(204).json({ message: 'Pessoa palestrante deletada com sucesso' });
});

module.exports = talkerRoutes;