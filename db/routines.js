const client = require('./client');

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
    INSERT INTO routines ("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
      [creatorId, isPublic, name, goal]
    );

    return routine;
  } catch (error) {
    console.error('error createRoutine fn', error);
  }
}

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
    SELECT * FROM routines
    WHERE id = $1
    `,
      [id]
    );

    return routine;
  } catch (error) {
    console.error('error get getRoutineById fn', error);
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows: routine } = await client.query(`
    SELECT * FROM routines
    `);

    return routine;
  } catch (error) {
    console.error('error getRoutinesWithoutActivities fn', error);
  }
}

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
    SELECT r.*, u.username AS "creatorName" FROM routines r
    JOIN users u ON u.id = r."creatorId"
    `);

    const { rows: routinesActivities } = await client.query(`
    SELECT ra.id AS "routineActivityId", * FROM routine_activities ra
    JOIN activities a ON a.id = ra."activityId"
    `);

    return routines.map((r) => {
      r.activities = routinesActivities.filter((ra) => ra.routineId == r.id);
      return r;
    });
  } catch (error) {
    console.error('error getAllRoutines fn', error);
  }
}

async function getAllPublicRoutines() {
  try {
    const routines = await getAllRoutines();

    return routines.filter((r) => r.isPublic);
  } catch (error) {
    console.error('error getAllPublicRoutines fn', error);
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const routines = await getAllRoutines(username);

    return routines.filter((r) => r.creatorName === username);
  } catch (error) {
    console.error('error getAllRoutinesByUser fn', error);
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const routines = await getAllRoutines(username);

    return routines.filter((r) => r.isPublic);
  } catch (error) {
    console.error('error getPublicRoutinesByUser fn', error);
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const routines = await getAllRoutines(id);

    return routines.filter((r) => {
      if (!r.isPublic) {
        return false;
      }
      const hasActivity = r.activities.some((a) => a.id === id);
      return hasActivity;
    });
  } catch (error) {
    console.error('error getPublicRoutinesByActivity fn', error);
  }
}

async function updateRoutine({ id, ...fields }) {
  try {
    const setString = Object.keys(fields)
      .map((key, index) => `"${key}"=$${index + 1}`)
      .join(', ');

    const {
      rows: [routine],
    } = await client.query(
      `
    UPDATE routines
    SET ${setString}
    WHERE id = ${id}
    RETURNING *
    `,
      Object.values(fields)
    );

    return routine;
  } catch (error) {
    console.error('error updateRoutine fn', error);
  }
}

async function destroyRoutine(id) {
  try {
    await client.query(
      `
    DELETE FROM routine_activities
    WHERE "routineId" = $1
    `,
      [id]
    );
    await client.query(
      `
    DELETE FROM routines
    WHERE id = $1
    `,
      [id]
    );
  } catch (error) {
    console.error('error destroyRoutine fn', error);
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
