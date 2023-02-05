/* eslint-disable no-useless-catch */
const express = require('express');
const router = express.Router();
const { createUser, getUserByUsername } = require('../db');

router.use((req, res, next) => {
  console.log('request being made to users');
  next();
});

// POST /api/users/register
router.post('/register', async (req, res, next) => {
  const { username, password } = req.body;
  console.log({ username, password });
  try {
    if (password.length < 8) {
      res.send({
        error: 'PasswordLengthError',
        name: 'PasswordInvalid',
        message: 'Password Too Short!',
      });
      return;
    }

    const user = await getUserByUsername(username);
    if (user) {
      res.send({
        error: 'UserExists',
        name: 'UserExists',
        message: `User ${user.username} is already taken.`,
      });
    }

    const newUser = await createUser({ username, password });
    res.send({
      message: 'User successfully registered',
      newUser,
    });
  } catch (error) {
    console.error('error register endpoint', error);
  }
});
// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
