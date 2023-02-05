const client = require('./client');

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
    INSERT INTO routine_activities ("routineId", "activityId", count, duration)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
      [routineId, activityId, count, duration]
    );

    return activity;
  } catch (error) {
    console.error('error addActivityToRoutine fn', error);
  }
}

async function getRoutineActivityById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
    SELECT * FROM routine_activities
    WHERE id = $1
    `,
      [id]
    );

    return routine;
  } catch (error) {
    console.error('error getRoutineActivityById fn', error);
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows: routines } = await client.query(
      `
    SELECT * FROM routine_activities
    WHERE "routineId" = $1
    `,
      [id]
    );

    return routines;
  } catch (error) {
    console.error('error getRoutineActivitiesByRoutine fn', error);
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  try {
    const setString = Object.keys(fields)
      .map((key, index) => `"${key}"=$${index + 1}`)
      .join(', ');

    const {
      rows: [routines],
    } = await client.query(
      `
    UPDATE routine_activities
    SET ${setString}
    WHERE id = ${id}
    RETURNING *
    `,
      Object.values(fields)
    );

    return routines;
  } catch (error) {
    console.error('error updateRoutineActivity fn', error);
  }
}

async function destroyRoutineActivity(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
    DELETE FROM routine_activities
    WHERE id = $1
    RETURNING *
    `,
      [id]
    );

    return routine;
  } catch (error) {
    console.error('error destroyRoutineActivity fn', error);
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    const {
      rows: [routines],
    } = await client.query(
      `
    SELECT r.* FROM routine_activities ra
    JOIN routines r ON r.id = ra."routineId"
    WHERE ra.id = $1 AND r."creatorId" = $2
    `,
      [routineActivityId, userId]
    );

    return routines;
  } catch (error) {
    console.error('error canEditRoutineActivity fn', error);
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
