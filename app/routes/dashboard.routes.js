const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ message: 'protected' });
});

module.exports = router;
