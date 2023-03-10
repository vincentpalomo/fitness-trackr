/* eslint-disable no-useless-catch */
const express = require('express');
const router = express.Router();
const {
  createUser,
  getUserByUsername,
  getUser,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
} = require('../db');

const { requireUser } = require('./utils');

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

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
    next({
      error: 'PasswordInvalid',
      message: 'Incorrect Password',
    });
  }
});

// GET /api/users/me
router.get('/me', requireUser, async (req, res, next) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:username/routines
router.get('/:username/routines', async (req, res, next) => {
  const username = req.params.username;
  try {
    // check if user is valid
    const user = await getUserByUsername(username);
    if (!user) {
      // send error if not valid
      next({
        name: 'UserNotFoundError',
        message: 'User Not Found',
      });
    } else if (user.id === req.user.id) {
      // if user id matches the req user id (logged in)
      const activities = await getAllRoutinesByUser({ username });
      res.send(activities);
    } else {
      // get all public routines of user
      const activities = await getPublicRoutinesByUser({ username });
      res.send(activities);
    }
  } catch (error) {
    console.error('error /:username/routines endpoint');
    next({
      error: 'NoRoutinesFound',
      message: `No routines have been set by ${username}`,
    });
  }
});

module.exports = router;
