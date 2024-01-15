const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const db = require('./models');
const authRoutes = require('./app/routes/auth.routes');
const middleware = require('./app/middlewares/cookies.middleware');

const app = express();
const port = 3000;
const corsOptions = {
  origin: 'http://localhost:3200',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

db.sequelize
  .sync()
  .then(() => {
    console.log('Synced db.');
  })
  .catch((err) => {
    console.log(`Failed to sync db: ${err.message}`);
  });

app.use('/api/v1/auth', authRoutes);
app.get('/api/v1/dashboard', middleware.cookiesMiddleware, (req, res) => {
  res.send({ message: 'Protected' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
