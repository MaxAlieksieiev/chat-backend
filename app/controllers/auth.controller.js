const db = require('../../models');

const { user } = db;

async function register(req, res) {
  const { lastName, firstName, email, password, nickName } = req.body;
  if (!email || !nickName || !password) {
    return res.status(400).send({
      message: 'Email, nickname, password are necessary fields',
    });
  }
  try {
    const userWithCurrentEmail = await user.findOne({ where: { email } });

    if (userWithCurrentEmail) {
      return res.status(400).send({
        message: 'This email is already used',
      });
    }

    const userWithCurrentNickName = await user.findOne({ where: { nickName } });

    if (userWithCurrentNickName) {
      return res.status(400).send({
        message: 'This nickname is already used',
      });
    }

    const newUser = await user.create({
      email,
      password,
      lastName,
      firstName,
      nickName,
    });
    if (newUser) {
      const { password, ...otherInfo } = newUser.dataValues;
      return res.status(200).send({
        message: 'User is created successfully',
        data: otherInfo,
      });
    }
    return res.status(400).send({
      message: 'Something went wrong',
    });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
}

module.exports = {
  register,
};
