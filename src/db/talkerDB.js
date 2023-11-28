const fs = require('fs').promises;
const { join } = require('path');

const dbPath = join(__dirname, '..', 'talker.json');

const readDB = async () => {
  const db = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(db);
};

const getAll = async () => {
  const talker = await readDB();
  return talker;
};

module.exports = {
  getAll,
};