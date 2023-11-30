module.exports = (req, res, next) => {
  const { date } = req.query;
  
  if (date) {
    const regexDate = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/;

    if (!regexDate.test(date)) {
      return res.status(400).json({ 
        message: 'O parâmetro "date" deve ter o formato "dd/mm/aaaa"' });
    }
  }
  next();
};