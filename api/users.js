/* eslint-disable no-useless-catch */
const express = require('express');
const router = express.Router();
const { createUser, getUserByUsername, getUser } = require('../db');

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

router.use((req, res, next) => {
  console.log('request being made to users');
  next();
});

// POST /api/users/register
router.post('/register', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (password.length < 8) {
      res.send({
        error: 'PasswordLengthError',
        name: 'PasswordInvalid',
        message: 'Password Too Short!',
      });
      return;
    }

    const checkUser = await getUserByUsername(username);
    if (checkUser) {
      res.send({
        error: 'UserExists',
        name: 'UserExists',
        message: `User ${username} is already taken.`,
      });
    }

    const user = await createUser({ username, password });

    const token = jwt.sign(
      {
        id: user.id,
        password: password,
      },
      JWT_SECRET
    );

    res.send({
      token,
      message: 'User successfully registered',
      user,
    });
  } catch (error) {
    console.error('error register endpoint', error);
  }
});
// POST /api/users/login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await getUser({ username, password });
    console.log({ user });

    if (!username || !password) {
      next({
        name: 'MissingCredentialError',
        message: 'Please supply both username and password',
      });
    }

    const token = jwt.sign({ id: user.id, username: username }, JWT_SECRET);

    res.send({ user, message: "you're logged in!", token });
  } catch (error) {
    console.error('error login endpoint', error);
  }
});

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
