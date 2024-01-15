require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../models');

const { user, token } = db;

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

async function login(req, res) {
  const { password: userPassword, username } = req.body;
  let userFromDb;
  try {
    if (username.includes('@')) {
      const userWithEmail = await user.findOne({ where: { email: username } });
      if (!userWithEmail) {
        return res.status(200).send({
          message: 'User with this email is not found',
        });
      }
      userFromDb = userWithEmail.dataValues;
    } else {
      const userWithNickName = await user.findOne({
        where: { nickName: username },
      });
      if (!userWithNickName) {
        return res.status(200).send({
          message: 'User with this nickname is not found',
        });
      }
      userFromDb = userWithNickName.dataValues;
    }

    const isValidPassword = await bcrypt.compare(
      userPassword,
      userFromDb.password
    );

    if (!isValidPassword) {
      return res.status(400).send({
        message: 'Password is wrong',
      });
    }

    const accessToken = jwt.sign(
      {
        id: userFromDb.id,
        email: userFromDb.email,
        nickName: userFromDb.nickName,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRED,
      }
    );

    const refreshToken = jwt.sign(
      {
        id: userFromDb.id,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRED,
      }
    );
    const payloadForCreateToken = { refreshToken, userId: userFromDb.id };

    const newToken = await token.findOne({ where: { userId: userFromDb.id } });
    if (!newToken) {
      await token.create(payloadForCreateToken);
    } else {
      newToken.refreshToken = refreshToken;
      await newToken.save();
    }

    const { password, ...userInfo } = userFromDb;
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    return res.status(200).send({
      data: { ...userInfo },
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message || 'Something went wrong',
    });
  }
}

async function refreshToken(req, res) {
  const { refreshToken } = req.cookies;
  try {
    const isValidRefreshToken = jwt.verify(
      refreshToken,
      process.env.TOKEN_SECRET
    );
    const { id } = isValidRefreshToken;
    const currentUser = await user.findByPk(id);
    const newAccessToken = jwt.sign(
      {
        id: currentUser.id,
        email: currentUser.email,
        nickName: currentUser.nickName,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRED,
      }
    );
    const newRefreshToken = jwt.sign(
      {
        id: currentUser.id,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRED,
      }
    );

    const currentToken = await token.findOne({ where: { userId: id } });
    currentToken.refreshToken = newRefreshToken;
    await currentToken.save();
    res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
    });
    return res.status(200).send({
      message: 'Token is updated',
    });
  } catch (error) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(401).send({
      message: error.message || 'Something went wrong',
    });
  }
}

module.exports = {
  register,
  login,
  refreshToken,
};
