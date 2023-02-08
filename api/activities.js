const express = require('express');
const {
  getActivityById,
  getAllActivities,
  createActivity,
  getPublicRoutinesByActivity,
  updateActivity,
  getActivityByName,
} = require('../db');
const { requireUser } = require('./utils');
const router = express.Router();

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async (req, res, next) => {
  try {
    const id = req.params.activityId;
    const activity = await getActivityById(id);

    if (activity) {
      const routine = await getPublicRoutinesByActivity(activity);
      res.send(routine);
    } else {
      next({
        error: 'ErrorMissingActivity',
        name: 'Missing Activity Error',
        message: 'Activity 10000 not found',
      });
    }
  } catch (error) {
    console.error('error /:activityId/routines endpoint', error);
  }
});

// GET /api/activities
router.get('/', async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    console.error('error get activities/ endpoint', error);
  }
});

// POST /api/activities
router.post('/', requireUser, async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const newActivity = await createActivity({ name, description });
    if (newActivity) {
      res.send(newActivity);
    } else {
      next({
        name: 'DuplicateActivityError',
        message: `An activity with name ${name} already exists`,
      });
    }
  } catch (error) {
    console.error('error post activities/ endpoint', error);
  }
});

// PATCH /api/activities/:activityId
router.patch('/:activityId', requireUser, async (req, res, next) => {
  const id = req.params.activityId;
  const { name, description } = req.body;

  const modActivity = await updateActivity({ id, name, description });
  const existingActivity = await getActivityByName(name);

  if (modActivity) {
    res.send(modActivity);
  } else if (existingActivity && name === existingActivity.name) {
    next({
      error: 'ErrorActivityExists',
      name: 'Activity Exists Error',
      message: `An activity with name ${name} already exists`,
    });
  } else {
    next({
      error: 'ErrorActivityNotFound',
      name: 'Activity not found',
      message: `Activity ${id} not found`,
    });
  }
});

module.exports = router;
