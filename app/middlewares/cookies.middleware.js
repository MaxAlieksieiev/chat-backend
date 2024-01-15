require('dotenv').config();

const jwt = require('jsonwebtoken');

async function cookiesMiddleware(req, res, next) {
  const { accessToken } = req.cookies;
  const { refreshToken } = req.cookies;
  if (!accessToken) {
    return res.status(403).send({
      message: 'Access token is not found',
    });
  }
  try {
    const isValidAccessToken = await jwt.verify(
      accessToken,
      process.env.TOKEN_SECRET
    );
    const isValidRefreshToken = await jwt.verify(
      refreshToken,
      process.env.TOKEN_SECRET
    );
    if (!isValidAccessToken) {
      if (!isValidRefreshToken) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return res.status(401).send({
          message: 'User should login again',
        });
      }
      return res.status(403).send({
        message: 'Update access token',
      });
    }
    return next();
  } catch (error) {
    console.log(1, error);
    return res.status(403).send({
      message: error.message,
    });
  }
}

module.exports = {
  cookiesMiddleware,
};
