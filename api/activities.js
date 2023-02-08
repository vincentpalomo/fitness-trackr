const express = require('express');
const { getActivityById, getAllActivities, createActivity } = require('../db');
const { requireUser } = require('./utils');
const router = express.Router();

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async (req, res, next) => {
  try {
    const id = req.params.activityId;
    console.log({ id });
    const activity = await getActivityById(id);
    console.log({ activity });
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

module.exports = router;
