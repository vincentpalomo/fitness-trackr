const express = require('express');
const {
  getAllRoutines,
  createRoutine,
  updateRoutine,
  destroyRoutine,
  getRoutineById,
  addActivityToRoutine,
} = require('../db');
const { requireUser } = require('./utils');
const router = express.Router();

// GET /api/routines
router.get('/', async (req, res, next) => {
  try {
    const routines = await getAllRoutines();
    res.send(routines);
  } catch (error) {
    next(error);
  }
});

// POST /api/routines
router.post('/', requireUser, async (req, res, next) => {
  try {
    const { isPublic, name, goal } = req.body;
    const creatorId = req.user.id;

    const newRoutine = await createRoutine({ creatorId, isPublic, name, goal });
    res.send(newRoutine);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/routines/:routineId
router.patch('/:routineId', requireUser, async (req, res, next) => {
  try {
    //get a routineId from params
    const id = req.params.routineId;
    const { isPublic, name, goal } = req.body;

    const routine = await updateRoutine({ id, isPublic, name, goal });
    // check if routine id is matching req.user id
    if (routine.id === req.user.id) {
      res.send(routine);
    } else {
      res.status(403);
      next({
        error: 'UnauthorizedError',
        name: 'UnauthorizedUpdateError',
        message: `User ${req.user.username} is not allowed to update Every day`,
      });
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/routines/:routineId
router.delete('/:routineId', requireUser, async (req, res, next) => {
  try {
    const id = req.params.routineId;
    const routine = await getRoutineById(id);

    if (routine && routine.creatorId === req.user.id) {
      await destroyRoutine(id);
      res.send(routine);
    } else {
      res.status(403);
      next({
        error: 'UnauthorizedDeleteError',
        name: 'UnauthorizedDeleteError',
        message: `User ${req.user.username} is not allowed to delete On even days`,
      });
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/routines/:routineId/activities
router.post('/:routineId/activities', async (req, res, next) => {
  try {
    const id = req.params.routineId;
    const { routineId, activityId, count, duration } = req.body;
    console.log({ id });

    const activity = await addActivityToRoutine({
      routineId,
      activityId,
      count,
      duration,
    });

    if (activity) {
      console.log({ activity });
      res.send(activity);
    } else {
      next({
        error: 'DuplicateRoutineActivityError',
        name: 'DuplicateRoutineActivityError',
        message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
