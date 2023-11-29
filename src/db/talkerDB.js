const fs = require('fs').promises;
const { join } = require('path');

const dbPath = join(__dirname, '..', 'talker.json');

const readData = async () => {
  const data = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(data);
};

const composeData = async (talkers) => {
  await fs.writeFile(dbPath, JSON.stringify(talkers));
};

const getAll = async () => {
  const talkers = await readData();
  return talkers;
};

const getById = async (id) => {
  const talkers = await readData();
  const talker = talkers.find((t) => t.id === Number(id));
  return talker;
};

const createTalker = async (talker) => {
  const talkers = await readData();
  const newTalker = { ...talker, id: talkers.length + 1 };
  talkers.push(newTalker);
  await composeData((talkers));
  return newTalker;
};

const upTalker = async (talker) => {
  const talkers = await readData();
  const index = talkers.findIndex((t) => t.id === talker.id);
  talkers[index] = talker;
  await composeData(talkers);
  return talker;
};

const dltTalker = async (id) => {
  const talkers = await readData();
  const index = talkers.findIndex((t) => t.id === Number(id));
  talkers.splice(index, 1);
  await composeData(talkers);
};

const searchTalker = async (searchTerm) => {
  const talkers = await readData();
  const filteredTalkers = searchTerm
    ? talkers.filter((t) => t.name.includes(searchTerm))
    : talkers;
  return filteredTalkers;
};

module.exports = {
  getAll,
  getById,
  createTalker,
  upTalker,
  dltTalker,
  readData,
  searchTalker,
};