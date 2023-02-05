const express = require('express');
const router = express.Router();

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

router.use((error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message,
  });
});

module.exports = router;
