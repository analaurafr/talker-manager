const { readData } = require('../db/talkerDB');

const validateAge = (req, res, next) => {
  const { age } = req.body;
  if (!age) return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  if (Number.isNaN(age)) {
    return res.status(400)
      .json({ message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' }); 
  } 
  if (!Number.isInteger(Number(age))) {
    return res.status(400)
      .json({ message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' }); 
  }
  if (Number(age) < 18) {
    return res.status(400)
      .json({ message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' }); 
  }
  next();
};
  
const validateTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  if (!talk.rate && Number(talk.rate) !== 0) {
    return res.status(400).json(
      { message: 'O campo "rate" é obrigatório' },
    ); 
  }
  next();
};
  
const validateWatchedAt = (req, res, next) => {
  const { talk } = req.body;
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  
  if (!talk.watchedAt || talk.watchedAt === '') {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!regex.test(talk.watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};
  
const validateRate = (req, res, next) => {
  const { talk } = req.body;
  if (!(Number(talk.rate) >= 1 && Number(talk.rate) <= 5)) {
    return res.status(400).json(
      { message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' },
    );
  }
  if (!Number.isInteger(Number(talk.rate))) {
    return res.status(400).json(
      { message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' },
    );
  }
  next();
};

const talkerSearch = async (q, rate, date) => {
  const talkers = await readData();
  return talkers.filter((t) => (q ? t.name.includes(q) : true))
    .filter((t) => (rate ? t.talk.rate.includes(rate) : true))
    .filter((t) => (date ? t.talk.date.includes(date) : true));
};

module.exports = {
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  talkerSearch,
};