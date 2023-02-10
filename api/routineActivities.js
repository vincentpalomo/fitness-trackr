const express = require('express');
const { canEditRoutineActivity, updateRoutineActivity } = require('../db');
const router = express.Router();

const { requireUser } = require('./utils');

// PATCH /api/routine_activities/:routineActivityId
router.patch('/:routineActivityId', requireUser, async (req, res, next) => {
  try {
    const { routineActivityId } = req.params;
    const { count, duration } = req.body;
    const { id, username } = req.user;

    const existingRoutineActivity = await canEditRoutineActivity(
      routineActivityId,
      id
    );

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

module.exports = router;
