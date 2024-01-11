const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./app/routes/auth.routes');
const db = require('./models');

const port = 3000;
const corsOptions = {
  origin: 'http://localhost:3200',
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.sequelize
  .sync()
  .then(() => {
    console.log('Synced db.');
  })
  .catch((err) => {
    console.log(`Failed to sync db: ${err.message}`);
  });

app.use('/api/v1/auth', authRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
