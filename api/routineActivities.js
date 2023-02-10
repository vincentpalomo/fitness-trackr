const express = require('express');
const {
  canEditRoutineActivity,
  updateRoutineActivity,
  destroyRoutineActivity,
} = require('../db');
const router = express.Router();

const { requireUser } = require('./utils');

// PATCH /api/routine_activities/:routineActivityId
router.patch('/:routineActivityId', requireUser, async (req, res, next) => {
  try {
    const id = req.params.routineActivityId;
    const { count, duration } = req.body;
    const userId = req.user.id;
    const username = req.user.username;

    const existingRoutineActivity = await canEditRoutineActivity(id, userId);

    if (!existingRoutineActivity) {
      next({
        error: 'error',
        name: 'name',
        message: `User ${username} is not allowed to update In the evening`,
      });
    } else {
      const modRoutineActivity = await updateRoutineActivity({
        id,
        count,
        duration,
      });
      res.send(modRoutineActivity);
    }
  } catch (error) {
    console.error('error patch routine_activities/:id endpoint', error);
  }
});

// DELETE /api/routine_activities/:routineActivityId
router.delete('/:routineActivityId', requireUser, async (req, res, next) => {
  const { routineActivityId } = req.params;
  const { id, username } = req.user;

  const existingActivity = await canEditRoutineActivity(routineActivityId, id);

  if (!existingActivity) {
    res.status(403);
    next(
      !existingActivity
        ? {
            error: 'error',
            name: 'name',
            message: `User ${username} is not allowed to delete In the afternoon`,
          }
        : {
            name: 'name',
            message: 'message',
          }
    );
  } else {
    const deleteRoutine = await destroyRoutineActivity(routineActivityId);
    res.send(deleteRoutine);
  }
});

module.exports = router;
