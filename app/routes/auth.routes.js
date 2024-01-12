const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/login', (req, res) => {
  res.send('Hello');
});

router.post('/registration', async (req, res) =>
  authController.register(req, res)
);

module.exports = router;
