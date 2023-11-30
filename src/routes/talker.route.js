const { Router } = require('express');

const { getAll, getById, createTalker, upTalker, dltTalker,  
  readData, 
  composeData } = require('../db/talkerDB');

const validateName = require('../middleware/validateName');
const validateAuth = require('../middleware/validateAuth');
const { validateAge, validateTalk, validateRate, 
  validateWatchedAt } = require('../middleware/validates');
const validateSearch = require('../middleware/validateSearch');
const validateDate = require('../middleware/validateDate');
const validateRates = require('../middleware/validateRates');

const talkerRoutes = Router();

talkerRoutes.get('/', async (req, res) => {
  const talkers = await getAll();
  return res.status(200).json(talkers);
});

talkerRoutes.get('/search', 
  validateAuth, validateSearch, validateDate,
  async (req, res) => {
    const { q, rate, date } = req.query;
    const data = await readData();
    let filteredTalkers = data;

    if (q) { 
      filteredTalkers = filteredTalkers.filter((talker) => talker.name.includes(q)); 
    }
    if (rate) {
      filteredTalkers = filteredTalkers.filter((talker) => talker.talk.rate === Number(rate));
    }
    if (date) {
      filteredTalkers = filteredTalkers.filter((talker) => talker.talk.watchedAt === date);
    } 
    return res.status(200).json(filteredTalkers); 
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

talkerRoutes.patch('/rate/:id', validateAuth, validateRates, async (req, res) => {
  const { id } = req.params;
  const { rate } = req.body;
  
  const talkers = await readData();
  const talkerIndex = talkers.findIndex((talk) => talk.id === Number(id));
  
  if (talkerIndex === -1) {
    return res.status(404).json({ message: 'Palestrante não encontrado' });
  }
  
  talkers[talkerIndex].talk.rate = Number(rate);
  await composeData(talkers);
  return res.status(204).end();
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