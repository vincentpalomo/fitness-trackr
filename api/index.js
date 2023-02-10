const express = require('express');
const router = express.Router();
const { getUserById } = require('../db');

// import jwt
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// check authorization
router.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch (error) {
      console.error('error with jwt assignment');
    }
  }
});

// GET /api/health
router.get('/health', async (req, res, next) => {
  try {
    res.status(200).json({ message: 'healthy' });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require('./activities');
router.use('/activities', activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require('./routines');
router.use('/routines', routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require('./routineActivities');
router.use('/routine_activities', routineActivitiesRouter);

// error 404 /unknown
router.get('*', async (req, res, next) => {
  try {
    res.status(404).json({ message: '404 NOT FOUND' });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// error handler
router.use((error, req, res, next) => {
  res.send({
    error: 'error',
    name: error.name,
    message: error.message,
  });
});

module.exports = router;
