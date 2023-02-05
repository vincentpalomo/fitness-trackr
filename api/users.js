/* eslint-disable no-useless-catch */
const express = require('express');
const router = express.Router();
const {
  createUser,
  getUserByUsername,
  getUser,
  getAllRoutinesByUser,
} = require('../db');

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

    const token = jwt.sign({ id: user.id, password: password }, JWT_SECRET);

    res.send({
      token,
      message: 'User successfully registered',
      user,
    });
  } catch (error) {
    console.error('error register endpoint', error);
    next(error);
  }
});

// POST /api/users/login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await getUser({ username, password });

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
router.get('/me', async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:username/routines
router.get('/:username/routines', async (req, res, next) => {
  try {
    const username = req.params.username;
    // const user = await getUserByUsername(username);
    const activities = await getAllRoutinesByUser({ username });
    console.log({ activities });
    // const activities = getActivities.map((a) => a.activities);
    res.send({ activities });
  } catch (error) {
    console.error('error /:username/routines endpoint');
  }
  // res.status(200).json({ message: 'username/routine endpoint' });
});

module.exports = router;
