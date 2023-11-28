const fs = require('fs').promises;
const { join } = require('path');

const dbPath = join(__dirname, '..', 'talker.json');

const readData = async () => {
  const data = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(data);
};

const getAll = async () => {
  const talker = await readData();
  return talker;
};

const getById = async (id) => {
  const talkers = await readData();
  const talker = talkers.find((t) => t.id === Number(id));
  return talker;
};

module.exports = {
  getAll,
  getById,
};